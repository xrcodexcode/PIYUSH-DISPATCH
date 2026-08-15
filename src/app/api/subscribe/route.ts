import { 
  isValidEmail, 
  sanitizeEmail, 
  isSafeRemoteEndpoint, 
  subscribeRateLimiter, 
  getClientIp 
} from '@/lib/security';

type SubscribePayload = {
  email?: unknown;
  source?: unknown;
  website?: unknown; // Honeypot trap
};

export async function POST(request: Request) {
  // 1. Sliding window IP rate limiting
  const clientIp = getClientIp(request);
  const rateLimitResult = subscribeRateLimiter.check(clientIp);

  if (!rateLimitResult.allowed) {
    const retrySecs = Math.ceil(rateLimitResult.resetTimeMs / 1000);
    return new Response(
      JSON.stringify({ 
        message: 'Too many subscription attempts. Please wait a moment and try again.' 
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retrySecs),
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  // 2. Safe JSON body extraction with size limit guard
  let payload: SubscribePayload;
  try {
    const text = await request.text();
    // Enforce 10KB max payload size to prevent memory exhaustion
    if (text.length > 10240) {
      return Response.json({ message: 'Payload too large.' }, { status: 413 });
    }
    payload = JSON.parse(text);
  } catch {
    return Response.json({ message: 'Invalid request payload.' }, { status: 400 });
  }

  // 3. Honeypot Bot Trap: If hidden bot field is filled, silently discard & return 202
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return Response.json({ message: 'Subscription received.' }, { status: 202 });
  }

  // 4. Strict Email Sanitization & Validation
  const rawEmail = typeof payload.email === 'string' ? payload.email : '';
  const email = sanitizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return Response.json({ message: 'Please provide a valid email address.' }, { status: 400 });
  }

  const substackRedirectUrl = `https://xrcodex.substack.com/subscribe?email=${encodeURIComponent(email)}`;
  const endpoint = process.env.NEWSLETTER_SUBSCRIBE_ENDPOINT;
  const apiKey = process.env.NEWSLETTER_API_KEY;

  // If no external custom backend is configured, seamlessly redirect to Substack
  if (!endpoint || !apiKey) {
    return Response.json(
      {
        message: "You're subscribed! Redirecting to Substack to confirm...",
        redirectUrl: substackRedirectUrl,
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  // 5. SSRF Guard on Remote Endpoint
  if (!isSafeRemoteEndpoint(endpoint)) {
    console.error(`[SECURITY ALERT] Blocked SSRF attempt to non-whitelisted endpoint: ${endpoint}`);
    return Response.json(
      { message: 'Internal service configuration error.' },
      { status: 500 }
    );
  }

  // 6. Secure Upstream Webhook Delivery with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const safeSource = typeof payload.source === 'string' 
      ? payload.source.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50) 
      : 'website';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        source: safeSource,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return Response.json(
        { message: 'Could not complete subscription right now.' },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "Subscription confirmed! Redirecting to Substack...",
        redirectUrl: substackRedirectUrl,
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch {
    return Response.json(
      { message: 'Service temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}

