import math
from PIL import Image, ImageDraw, ImageFont

# 1. Load fresh original 4.jpg
img = Image.open('public/assets/daily-node-9/4.jpg').convert('RGBA')
w, h = img.size

# 2. Extract background color from the screen document (#F5F5F4)
bg_color = (245, 246, 247, 255)
draw = ImageDraw.Draw(img)

# Clear the old body text area (leaving the top "MORNING EXECUTIVE TECH BRIEFING" title intact)
# The text to replace is between y=355 and y=670, x=240 and x=485
poly_clear = [
    (245, 360),
    (480, 335),
    (485, 625),
    (250, 665)
]
draw.polygon(poly_clear, fill=bg_color)

# 3. Render individual text lines onto small rotated strips and composite with sub-pixel precision
font_date = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 11)
font_h2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 10)
font_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 9)
font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 8)
font_mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 8)

def draw_tilted_text(base_img, text, x, y, font, color, angle=-5.8):
    # Render at 2x scale for sharp text
    scale = 2
    bbox = font.getbbox(text)
    tw = (bbox[2] - bbox[0] + 10) * scale
    th = (bbox[3] - bbox[1] + 6) * scale
    
    strip_font = ImageFont.truetype(font.path, font.size * scale)
    strip = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(strip)
    s_draw.text((2 * scale, 1 * scale), text, fill=color, font=strip_font)
    
    # Downscale for supersampling
    strip_1x = strip.resize((tw // scale, th // scale), Image.LANCZOS)
    
    # Rotate by angle
    rotated = strip_1x.rotate(angle, resample=Image.BICUBIC, expand=True)
    base_img.alpha_composite(rotated, (int(x), int(y)))

# Line angle slope: -5.8 degrees
lines = [
    ("DATE: AUG 20, 2026 | 06:00:00 AM AUTOMATED DIGEST", 252, 366, font_date, (194, 65, 12)),
    ("TODAY'S DAILY DIGEST & SIGNAL", 253, 390, font_h2, (15, 23, 42)),
    ("• Autonomous AI Loops:", 253, 412, font_bold, (15, 23, 42)),
    ("  Cron triggers morning research agents to aggregate breaking tech news,", 253, 426, font_body, (71, 85, 105)),
    ("  filter noise, and synthesize executive briefings autonomously.", 253, 439, font_body, (71, 85, 105)),
    ("• Linux Background Daemons:", 253, 460, font_bold, (15, 23, 42)),
    ("  The cron daemon wakes every 60s, evaluates cron expressions,", 253, 474, font_body, (71, 85, 105)),
    ("  and spawns sub-processes with zero idle memory footprint.", 253, 487, font_body, (71, 85, 105)),
    ("• Frontier Reasoning Benchmarks:", 253, 508, font_bold, (15, 23, 42)),
    ("  State-of-the-art open-weights models achieve 94% on SWE-bench", 253, 522, font_body, (71, 85, 105)),
    ("  via multi-agent orchestration and dynamic tool harnesses.", 253, 535, font_body, (71, 85, 105)),
    ("SYSTEM AUTOMATION STATUS", 253, 558, font_h2, (15, 23, 42)),
    ("✓ HackerNews & GitHub: 42 breaking stories indexed", 253, 574, font_mono, (22, 101, 52)),
    ("✓ Briefing Generated: 06:00:04 AM (Trigger: 0 6 * * *)", 253, 588, font_mono, (194, 65, 12)),
]

for text, x, y, font, color in lines:
    draw_tilted_text(img, text, x, y, font, color, angle=-5.8)

# Save result to public/assets/daily-node-11/4.jpg
img.convert('RGB').save('public/assets/daily-node-11/4.jpg', quality=98)
print("Aligned 4.jpg text with pixel-perfect perspective and August 20 date!")
