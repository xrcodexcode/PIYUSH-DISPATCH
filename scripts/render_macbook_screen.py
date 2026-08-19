import os
from PIL import Image, ImageDraw, ImageFont

# 1. Load base image
base = Image.open('public/assets/daily-node-11/4.jpg').convert('RGBA')
w, h = base.size

# Let's inspect the exact corners of the display on the MacBook Pro:
# The screen bezel in 4.jpg:
# Top-Left corner of screen inside bezel: (283, 276)
# Top-Right corner of screen inside bezel: (678, 305)
# Bottom-Right corner of screen inside bezel: (572, 706)
# Bottom-Left corner of screen inside bezel: (288, 642)
# Let's refine these coordinates

# Let's create a high-resolution 2D document canvas (e.g. 1000 x 1200)
doc_w, doc_h = 1200, 1400
doc = Image.new('RGBA', (doc_w, doc_h), (248, 249, 250, 255))
draw = ImageDraw.Draw(doc)

# Try loading standard Windows TrueType fonts
try:
    font_header = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 52)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 32)
    font_date = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 28)
    font_h2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 38)
    font_body_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 30)
    font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 27)
    font_mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 26)
except Exception:
    font_header = ImageFont.load_default()
    font_sub = font_header
    font_date = font_header
    font_h2 = font_header
    font_body_bold = font_header
    font_body = font_header
    font_mono = font_header

# Draw Top Header
draw.text((70, 70), "MORNING EXECUTIVE TECH BRIEFING", fill=(20, 20, 20), font=font_header)
draw.line([(70, 145), (1130, 145)], fill=(200, 200, 200), width=3)

# Date & Automated Timestamp (AUG 20, 2026)
draw.text((70, 170), "DATE: AUG 20, 2026 | 06:00:00 AM AUTOMATED DISPATCH", fill=(190, 80, 20), font=font_date)

# Section: KEY TAKEAWAYS & DAILY DIGEST
draw.text((70, 235), "TODAY'S DAILY DIGEST & SIGNAL", fill=(20, 20, 20), font=font_h2)

# Item 1: Autonomous Agent Loops
draw.text((70, 305), "• Autonomous AI Loops:", fill=(15, 23, 42), font=font_body_bold)
draw.text((105, 348), "Cron triggers morning research agents to aggregate breaking tech news,", fill=(70, 70, 70), font=font_body)
draw.text((105, 388), "filter noise, and compile structured executive briefings autonomously.", fill=(70, 70, 70), font=font_body)

# Item 2: Linux Kernel & Daemons
draw.text((70, 455), "• Linux Background Daemons:", fill=(15, 23, 42), font=font_body_bold)
draw.text((105, 498), "The cron daemon wakes every 60s, inspects the system clock,", fill=(70, 70, 70), font=font_body)
draw.text((105, 538), "and spawns sub-processes with zero idle memory footprint.", fill=(70, 70, 70), font=font_body)

# Item 3: Open-Weights Ecosystem
draw.text((70, 605), "• Open-Weights Frontier Benchmarks:", fill=(15, 23, 42), font=font_body_bold)
draw.text((105, 648), "New reasoning architectures achieve 94% on SWE-bench with local", fill=(70, 70, 70), font=font_body)
draw.text((105, 688), "sub-agent orchestration and persistent memory pipelines.", fill=(70, 70, 70), font=font_body)

# Section: SYSTEM ACTIONS
draw.line([(70, 760), (1130, 760)], fill=(220, 220, 220), width=2)
draw.text((70, 785), "AUTOMATED ACTIONS COMPLETED", fill=(20, 20, 20), font=font_h2)

draw.text((70, 850), "✓ GitHub Feed Synced: 14 commits merged across core repos", fill=(22, 101, 52), font=font_mono)
draw.text((70, 895), "✓ Server Logs Analyzed: 0 errors, uptime 99.998%", fill=(22, 101, 52), font=font_mono)
draw.text((70, 940), "✓ Digest Delivered: Generated in 4.2s (Next trigger: Aug 21, 06:00 AM)", fill=(190, 80, 20), font=font_mono)

doc.save('doc_preview.png')
print("Document canvas created successfully!")
