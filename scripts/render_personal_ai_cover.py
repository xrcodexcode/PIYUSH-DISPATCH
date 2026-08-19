import math
from PIL import Image, ImageDraw, ImageFont

# Load pristine original from git HEAD
img = Image.open('public/assets/daily-node-9/4.jpg').convert('RGBA')

# Exact paper background color (#F6F6F6)
bg_color = (246, 246, 246, 255)
draw = ImageDraw.Draw(img)

# Clear the body text region directly on the screen (x between 342 and 645)
poly_clear = [
    (343, 362),
    (642, 348),
    (648, 680),
    (347, 694)
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

# Render lines directly on the MacBook display for Issue #001 "The Personal AI" (Publish date: AUG 12, 2026)
draw_tilted_line(img, "DATE: AUG 12, 2026 | 06:00:00 AM PERSONAL BRIEFING", 345, 368, font_date, (180, 83, 9))
draw_tilted_line(img, "TODAY'S KNOWLEDGE GRAPH & SIGNAL", 347, 392, font_h2, (15, 23, 42))

draw_tilted_line(img, "• Personal Knowledge Vault:", 347, 416, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Indexed 14 new atomic nodes across research notes & vault,", 355, 431, font_body, (71, 85, 105))
draw_tilted_line(img, "  updating semantic backlinks and topic cluster relationships.", 355, 444, font_body, (71, 85, 105))

draw_tilted_line(img, "• Tri-Tier Memory Architecture:", 349, 466, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Synchronized working context, episodic interaction logs,", 357, 481, font_body, (71, 85, 105))
draw_tilted_line(img, "  and long-term knowledge graph for lifetime continuity.", 357, 494, font_body, (71, 85, 105))

draw_tilted_line(img, "• Proactive Agent Research:", 351, 516, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Summarized 3 frontier papers on GraphRAG and MCP protocol specs,", 359, 531, font_body, (71, 85, 105))
draw_tilted_line(img, "  preparing draft executive briefs before your morning routine.", 359, 544, font_body, (71, 85, 105))

draw_tilted_line(img, "TODAY'S PRIORITIZED FOCUS", 353, 568, font_h2, (15, 23, 42))
draw_tilted_line(img, "✓ Architecture: 16 themes and zero-data-loss verified", 361, 586, font_mono, (22, 101, 52))
draw_tilted_line(img, "✓ Next Steps: Agent Skills & Loop Engineering drafts ready", 361, 600, font_mono, (180, 83, 9))

# Save output to deep-node-1/macbook_briefing.jpg
img.convert('RGB').save('public/assets/deep-node-1/macbook_briefing.jpg', quality=98)
print("Rendered perfectly aligned The Personal AI hero cover image for Aug 12, 2026!")
