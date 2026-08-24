import { ImageResponse } from 'next/og';

export const alt = "PIYUSH'S DISPATCH — Ideas, Analysis & Daily Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Accent line */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: '#e5793a',
            marginBottom: 32,
            borderRadius: 2,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: '80%',
          }}
        >
          PIYUSH&apos;S DISPATCH
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 20,
            textAlign: 'center',
            fontWeight: 400,
            letterSpacing: '0.05em',
          }}
        >
          Ideas, Analysis & Daily Intelligence
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 14,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          dispatch.piyush.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
