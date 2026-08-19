import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def find_coeffs(pa, pb):
    matrix = []
    for p1, p2 in zip(pa, pb):
        matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0]*p1[0], -p2[0]*p1[1]])
        matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1]*p1[0], -p2[1]*p1[1]])

    A = []
    B = []
    for p1, p2 in zip(pa, pb):
        A.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0]*p1[0], -p2[0]*p1[1]])
        A.append([0, 0, 0, p1[0], p1[1], 1, -p2[1]*p1[0], -p2[1]*p1[1]])
        B.append(p2[0])
        B.append(p2[1])

    n = len(B)
    M = [A[i] + [B[i]] for i in range(n)]

    for i in range(n):
        max_row = i
        for k in range(i + 1, n):
            if abs(M[k][i]) > abs(M[max_row][i]):
                max_row = k
        M[i], M[max_row] = M[max_row], M[i]

        pivot = M[i][i]
        if abs(pivot) < 1e-12:
            continue
        for j in range(i, n + 1):
            M[i][j] /= pivot

        for k in range(n):
            if k != i:
                factor = M[k][i]
                for j in range(i, n + 1):
                    M[k][j] -= factor * M[i][j]

    return [M[i][n] for i in range(n)]

# 1. Load pristine original from git HEAD
base = Image.open('public/assets/daily-node-9/4.jpg').convert('RGBA')
w, h = base.size

# 2. Create high-resolution document canvas (scale = 3 for crystal clear text)
scale = 3
doc_w, doc_h = 400 * scale, 250 * scale
doc = Image.new('RGBA', (doc_w, doc_h), (246, 246, 246, 255))
draw = ImageDraw.Draw(doc)

font_date = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 11 * scale)
font_h2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 10 * scale)
font_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 9 * scale)
font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 8 * scale)
font_mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 8 * scale)

# Render text matching The Personal AI (Aug 12, 2026)
draw.text((10 * scale, 8 * scale), "DATE: AUG 12, 2026 | 06:00:00 AM PERSONAL BRIEFING", fill=(180, 83, 9), font=font_date)
draw.text((10 * scale, 28 * scale), "TODAY'S KNOWLEDGE GRAPH & SIGNAL", fill=(15, 23, 42), font=font_h2)

draw.text((10 * scale, 50 * scale), "• Personal Knowledge Vault:", fill=(15, 23, 42), font=font_bold)
draw.text((20 * scale, 64 * scale), "Indexed 14 new atomic nodes across research notes, knowledge vault & daily dispatches,", fill=(71, 85, 105), font=font_body)
draw.text((20 * scale, 77 * scale), "updating semantic backlinks, concept clusters, and hierarchical navigation layers.", fill=(71, 85, 105), font=font_body)

draw.text((10 * scale, 98 * scale), "• Tri-Tier Memory Architecture:", fill=(15, 23, 42), font=font_bold)
draw.text((20 * scale, 112 * scale), "Synchronized working context, episodic interaction logs, and long-term knowledge graph", fill=(71, 85, 105), font=font_body)
draw.text((20 * scale, 125 * scale), "for permanent personal context continuity across multi-agent workflows.", fill=(71, 85, 105), font=font_body)

draw.text((10 * scale, 146 * scale), "• Proactive Agent Research:", fill=(15, 23, 42), font=font_bold)
draw.text((20 * scale, 160 * scale), "Summarized 3 frontier technical papers on GraphRAG and Model Context Protocol specs,", fill=(71, 85, 105), font=font_body)
draw.text((20 * scale, 173 * scale), "synthesizing executive briefs before your morning work session begins.", fill=(71, 85, 105), font=font_body)

draw.text((10 * scale, 196 * scale), "TODAY'S PRIORITIZED FOCUS", fill=(15, 23, 42), font=font_h2)
draw.text((20 * scale, 212 * scale), "✓ Architecture: 16 themes and zero-data-loss verified", fill=(22, 101, 52), font=font_mono)
draw.text((20 * scale, 226 * scale), "✓ Next Steps: Agent Skills & Loop Engineering drafts ready", fill=(180, 83, 9), font=font_mono)

# Full document quad covering from left margin (x=248) to right margin (x=645):
dest_quad = [
    (248, 365),
    (645, 335),
    (650, 595),
    (252, 615)
]
src_rect = [(0, 0), (doc_w, 0), (doc_w, doc_h), (0, doc_h)]

coeffs = find_coeffs(dest_quad, src_rect)

# Perspective warp
warped = doc.transform((w, h), Image.PERSPECTIVE, coeffs, Image.BICUBIC)

# Smooth polygon mask
mask = Image.new('L', (w, h), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.polygon(dest_quad, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.8))

# Composite onto base image
result = Image.composite(warped, base, mask)

# Save to public/assets/deep-node-1/macbook_briefing.jpg
result.convert('RGB').save('public/assets/deep-node-1/macbook_briefing.jpg', quality=98)
print("Updated deep-node-1/macbook_briefing.jpg with full-width Aug 12 briefing!")
