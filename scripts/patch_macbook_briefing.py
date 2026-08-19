from PIL import Image, ImageDraw, ImageFont

# Load pristine original from deep-node-1/macbook_briefing.jpg
img = Image.open('public/assets/deep-node-1/macbook_briefing.jpg').convert('RGBA')

# Screen background color (#F6F6F6)
bg_color = (246, 246, 246, 255)
draw = ImageDraw.Draw(img)

# Clear only the body text region on the paper
poly_clear = [
    (248, 365),
    (480, 350),
    (486, 675),
    (252, 688)
]
draw.polygon(poly_clear, fill=bg_color)

# Fonts
font_date = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 11)
font_h2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 10)
font_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 9)
font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 8)
font_mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 8)

def draw_tilted_line(base_img, text, x, y, font, color, angle=-3.5):
    scale = 3
    bbox = font.getbbox(text)
    tw = (bbox[2] - bbox[0] + 16) * scale
    th = (bbox[3] - bbox[1] + 8) * scale
    
    strip_font = ImageFont.truetype(font.path, font.size * scale)
    strip = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(strip)
    s_draw.text((2 * scale, 1 * scale), text, fill=color, font=strip_font)
    
    strip_1x = strip.resize((tw // scale, th // scale), Image.LANCZOS)
    rotated = strip_1x.rotate(angle, resample=Image.BICUBIC, expand=True)
    base_img.alpha_composite(rotated, (int(x), int(y)))

# Render lines
draw_tilted_line(img, "DATE: AUG 20, 2026 | 06:00:00 AM AUTOMATED DIGEST", 252, 368, font_date, (180, 83, 9))
draw_tilted_line(img, "TODAY'S DAILY DIGEST & REAL-TIME SIGNAL", 254, 392, font_h2, (15, 23, 42))

draw_tilted_line(img, "• Autonomous AI Loops:", 254, 416, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Cron triggers research agents to aggregate breaking news,", 262, 431, font_body, (71, 85, 105))
draw_tilted_line(img, "  filter noise, and synthesize executive briefings autonomously.", 262, 444, font_body, (71, 85, 105))

draw_tilted_line(img, "• Linux Background Daemons:", 256, 466, font_bold, (15, 23, 42))
draw_tilted_line(img, "  The cron daemon wakes every 60s, evaluates cron rules,", 264, 481, font_body, (71, 85, 105))
draw_tilted_line(img, "  and spawns sub-processes with zero idle memory footprint.", 264, 494, font_body, (71, 85, 105))

draw_tilted_line(img, "• Frontier Reasoning Benchmarks:", 258, 516, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Open-weights frontier models achieve 94% on SWE-bench", 266, 531, font_body, (71, 85, 105))
draw_tilted_line(img, "  via multi-agent orchestration and dynamic tool harnesses.", 266, 544, font_body, (71, 85, 105))

draw_tilted_line(img, "SYSTEM AUTOMATION STATUS", 260, 568, font_h2, (15, 23, 42))
draw_tilted_line(img, "✓ Tech News & GitHub: 42 stories indexed at 06:00:00 AM", 268, 586, font_mono, (22, 101, 52))
draw_tilted_line(img, "✓ Briefing Generated in 4.2s (Next trigger: Aug 21, 06:00 AM)", 268, 600, font_mono, (180, 83, 9))

# Save to public/assets/daily-node-11/4.jpg and daily-node-9/4.jpg
img.convert('RGB').save('public/assets/daily-node-11/4.jpg', quality=98)
img.convert('RGB').save('public/assets/daily-node-9/4.jpg', quality=98)
print("Saved perfect 4.jpg with August 20 daily digest!")
