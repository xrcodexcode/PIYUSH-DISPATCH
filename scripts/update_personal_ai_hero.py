import math
from PIL import Image, ImageDraw, ImageFont

# Load pristine original from deep-node-1/macbook_briefing.jpg
img = Image.open('public/assets/deep-node-1/macbook_briefing.jpg').convert('RGBA')

# Paper background color from screen (#F6F6F6)
bg_color = (246, 246, 246, 255)
draw = ImageDraw.Draw(img)

# Clear the entire document text area including the old title and body
# Top title is from y=315 down to y=685, x=245 to 490
poly_clear = [
    (244, 316),
    (482, 302),
    (490, 680),
    (250, 695)
]
draw.polygon(poly_clear, fill=bg_color)

# Fonts
font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 13)
font_date = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 10)
font_h2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 10)
font_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 9)
font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 8)
font_mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 8)

def draw_tilted_line(base_img, text, x, y, font, color, angle=-3.5):
    scale = 3
    bbox = font.getbbox(text)
    tw = (bbox[2] - bbox[0] + 20) * scale
    th = (bbox[3] - bbox[1] + 10) * scale
    
    strip_font = ImageFont.truetype(font.path, font.size * scale)
    strip = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(strip)
    s_draw.text((3 * scale, 2 * scale), text, fill=color, font=strip_font)
    
    strip_1x = strip.resize((tw // scale, th // scale), Image.LANCZOS)
    rotated = strip_1x.rotate(angle, resample=Image.BICUBIC, expand=True)
    base_img.alpha_composite(rotated, (int(x), int(y)))

# Title & divider
draw_tilted_line(img, "THE PERSONAL AI — DAILY INTELLIGENCE", 248, 322, font_title, (15, 23, 42))

# Date matching Issue #1 publish date (AUG 12, 2026)
draw_tilted_line(img, "DATE: AUG 12, 2026 | 06:00:00 AM AUTOMATED BRIEFING", 250, 355, font_date, (180, 83, 9))

# Key Sections
draw_tilted_line(img, "TODAY'S CONTEXT & KNOWLEDGE GRAPH", 252, 380, font_h2, (15, 23, 42))

draw_tilted_line(img, "• Personal Knowledge Vault:", 252, 404, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Indexed 14 new atomic nodes across research notes & daily dispatches,", 260, 419, font_body, (71, 85, 105))
draw_tilted_line(img, "  updating semantic backlinks and topic cluster relationships.", 260, 432, font_body, (71, 85, 105))

draw_tilted_line(img, "• Tri-Tier Memory Architecture:", 254, 454, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Synchronized working context, episodic interaction logs,", 262, 469, font_body, (71, 85, 105))
draw_tilted_line(img, "  and long-term knowledge graph for lifetime continuity.", 262, 482, font_body, (71, 85, 105))

draw_tilted_line(img, "• Autonomous Research & Agency:", 256, 504, font_bold, (15, 23, 42))
draw_tilted_line(img, "  Summarized 3 frontier papers on GraphRAG and MCP protocol specs,", 264, 519, font_body, (71, 85, 105))
draw_tilted_line(img, "  preparing draft executive briefs before your morning routine.", 264, 532, font_body, (71, 85, 105))

draw_tilted_line(img, "TODAY'S PRIORITIZED FOCUS", 258, 558, font_h2, (15, 23, 42))
draw_tilted_line(img, "✓ Architecture: 16 themes and zero-data-loss verified", 266, 576, font_mono, (22, 101, 52))
draw_tilted_line(img, "✓ Next Steps: Agent Skills & Loop Engineering drafts ready", 266, 590, font_mono, (180, 83, 9))

# Save directly to deep-node-1/macbook_briefing.jpg
img.convert('RGB').save('public/assets/deep-node-1/macbook_briefing.jpg', quality=98)
print("Updated deep-node-1/macbook_briefing.jpg successfully with Aug 12, 2026 Personal AI briefing!")
