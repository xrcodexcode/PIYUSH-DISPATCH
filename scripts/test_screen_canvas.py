from PIL import Image, ImageDraw, ImageFont

# Load pristine original from git HEAD
img = Image.open('public/assets/daily-node-9/4.jpg').convert('RGBA')

# Full width of the document text region (width: 232, height: 280)
cw, ch = 232, 280
canvas = Image.new('RGBA', (cw, ch), (246, 246, 246, 255))
c_draw = ImageDraw.Draw(canvas)

# Fonts
font_date = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 10)
font_h2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 9)
font_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 8)
font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 7)
font_mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 7)

# Draw text on canvas
c_draw.text((6, 6), "DATE: AUG 12, 2026 | 06:00:00 AM PERSONAL BRIEFING", fill=(180, 83, 9), font=font_date)
c_draw.text((6, 26), "TODAY'S KNOWLEDGE GRAPH & SIGNAL", fill=(15, 23, 42), font=font_h2)

c_draw.text((6, 48), "• Personal Knowledge Vault:", fill=(15, 23, 42), font=font_bold)
c_draw.text((14, 61), "Indexed 14 new atomic nodes across research notes & vault,", fill=(71, 85, 105), font=font_body)
c_draw.text((14, 73), "updating semantic backlinks and topic cluster relationships.", fill=(71, 85, 105), font=font_body)

c_draw.text((6, 93), "• Tri-Tier Memory Architecture:", fill=(15, 23, 42), font=font_bold)
c_draw.text((14, 106), "Synchronized working context, episodic interaction logs,", fill=(71, 85, 105), font=font_body)
c_draw.text((14, 118), "and long-term knowledge graph for lifetime continuity.", fill=(71, 85, 105), font=font_body)

c_draw.text((6, 138), "• Proactive Agent Research:", fill=(15, 23, 42), font=font_bold)
c_draw.text((14, 151), "Summarized 3 frontier papers on GraphRAG and MCP protocol specs,", fill=(71, 85, 105), font=font_body)
c_draw.text((14, 163), "preparing draft executive briefs before your morning routine.", fill=(71, 85, 105), font=font_body)

c_draw.text((6, 185), "TODAY'S PRIORITIZED FOCUS", fill=(15, 23, 42), font=font_h2)
c_draw.text((14, 202), "✓ Architecture: 16 themes and zero-data-loss verified", fill=(22, 101, 52), font=font_mono)
c_draw.text((14, 216), "✓ Next Steps: Agent Skills & Loop Engineering drafts ready", fill=(180, 83, 9), font=font_mono)

# Rotate canvas slightly by -3.5 degrees
rot_canvas = canvas.rotate(-3.5, resample=Image.BICUBIC, expand=True)

# Composite onto base image at (345, 365)
img.alpha_composite(rot_canvas, (345, 365))

# Save test
img.save('screen_canvas_test.png')
print("Saved screen_canvas_test.png")
