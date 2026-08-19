import math
from PIL import Image, ImageDraw, ImageFont

# 1. Load original 4.jpg
img = Image.open('public/assets/daily-node-9/4.jpg').convert('RGBA')
w, h = img.size

# 2. The white document area on the laptop screen:
# We can create a high-resolution text layer rotated by -6.5 degrees
# Let's inspect the text bounding box on the screen:
# Left margin: x ≈ 240
# Right margin: x ≈ 485
# Top (Date line): y ≈ 360
# Bottom: y ≈ 675

# Let's clear the old blurry text with the matching paper white background color (#F4F4F3)
draw = ImageDraw.Draw(img)

# Cover the text area from y=355 down to y=675 with a seamless polygon
poly_clear = [
    (240, 360), # Top-Left of text area below title
    (480, 332), # Top-Right of text area
    (495, 630), # Bottom-Right
    (260, 695)  # Bottom-Left
]
draw.polygon(poly_clear, fill=(244, 245, 246, 255))

# 3. Create a crisp text canvas to render high-contrast text and rotate it onto the screen
# Create canvas at 2x resolution for ultra-sharp supersampling
scale = 2
canvas_w, canvas_h = 320 * scale, 420 * scale
txt_layer = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
txt_draw = ImageDraw.Draw(txt_layer)

font_date = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 13 * scale)
font_h2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 12 * scale)
font_body_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 11 * scale)
font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 10 * scale)
font_mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 9 * scale)

# Render Date (AUG 20, 2026)
txt_draw.text((10 * scale, 5 * scale), "DATE: AUG 20, 2026 | 06:00:00 AM AUTOMATED DIGEST", fill=(217, 119, 6), font=font_date)
txt_draw.line([(10 * scale, 22 * scale), (300 * scale, 22 * scale)], fill=(180, 180, 180), width=1 * scale)

# Item 1: Autonomous Agent Loops
txt_draw.text((10 * scale, 30 * scale), "• Autonomous AI Loops:", fill=(15, 23, 42), font=font_body_bold)
txt_draw.text((20 * scale, 45 * scale), "Cron triggers morning research agents to aggregate breaking tech news,", fill=(55, 65, 81), font=font_body)
txt_draw.text((20 * scale, 58 * scale), "filter signal from noise, and synthesize executive briefings autonomously.", fill=(55, 65, 81), font=font_body)

# Item 2: Linux Background Daemons
txt_draw.text((10 * scale, 76 * scale), "• Linux Background Daemons:", fill=(15, 23, 42), font=font_body_bold)
txt_draw.text((20 * scale, 91 * scale), "The cron daemon wakes every 60s, inspects the system clock,", fill=(55, 65, 81), font=font_body)
txt_draw.text((20 * scale, 104 * scale), "and spawns sub-processes with zero idle memory footprint.", fill=(55, 65, 81), font=font_body)

# Item 3: Open-Weights Frontier
txt_draw.text((10 * scale, 122 * scale), "• Frontier Reasoning Benchmarks:", fill=(15, 23, 42), font=font_body_bold)
txt_draw.text((20 * scale, 137 * scale), "State-of-the-art open-weights models achieve 94% on SWE-bench", fill=(55, 65, 81), font=font_body)
txt_draw.text((20 * scale, 150 * scale), "via multi-agent orchestration and dynamic tool harnesses.", fill=(55, 65, 81), font=font_body)

# System Summary & Pipeline Status
txt_draw.line([(10 * scale, 170 * scale), (300 * scale, 170 * scale)], fill=(200, 200, 200), width=1 * scale)
txt_draw.text((10 * scale, 178 * scale), "DAILY AUTOMATION PIPELINE STATUS", fill=(15, 23, 42), font=font_h2)

txt_draw.text((10 * scale, 196 * scale), "✓ HackerNews & GitHub: 42 breaking stories indexed", fill=(22, 101, 52), font=font_mono)
txt_draw.text((10 * scale, 210 * scale), "✓ ArXiv AI Papers: 8 agent architectures analyzed", fill=(22, 101, 52), font=font_mono)
txt_draw.text((10 * scale, 224 * scale), "✓ Briefing Generated: 06:00:04 AM (Trigger: 0 6 * * *)", fill=(180, 83, 9), font=font_mono)

# Downscale to crisp 1x size with high-quality resampling
txt_layer_1x = txt_layer.resize((canvas_w // scale, canvas_h // scale), Image.LANCZOS)

# Rotate text layer by -6.5 degrees to match laptop screen perspective
rotated_txt = txt_layer_1x.rotate(-6.5, resample=Image.BICUBIC, expand=True)

# Paste rotated text onto the laptop screen at (242, 355)
img.alpha_composite(rotated_txt, (240, 350))

# Save output to public/assets/daily-node-11/4.jpg
img.convert('RGB').save('public/assets/daily-node-11/4.jpg', quality=98)
print("Updated 4.jpg successfully with razor-sharp 20 Aug daily digest!")
