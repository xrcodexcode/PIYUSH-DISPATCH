from PIL import Image

img = Image.open('public/assets/deep-node-1/macbook_briefing.jpg').convert('RGB')
w, h = img.size
pixels = img.load()

# Find all pixels that belong to the white document on the screen:
# The document is bright white (r > 230, g > 230, b > 230)
# and is in the region x in [240, 520], y in [280, 680]

doc_pixels = []
for y in range(280, 670):
    for x in range(240, 520):
        r, g, b = pixels[x, y]
        if r > 230 and g > 230 and b > 230:
            doc_pixels.append((x, y))

# Find the 4 corners of this region:
# Top-Left: min(x + y)
tl = min(doc_pixels, key=lambda p: p[0]*1.2 + p[1])
# Top-Right: min(-x + y)
tr = min(doc_pixels, key=lambda p: -p[0]*1.2 + p[1])
# Bottom-Right: max(x + y)
br = max(doc_pixels, key=lambda p: p[0]*1.2 + p[1])
# Bottom-Left: max(-x + y)
bl = max(doc_pixels, key=lambda p: -p[0]*1.2 + p[1])

print(f"Top-Left Paper: {tl}")
print(f"Top-Right Paper: {tr}")
print(f"Bottom-Right Paper: {br}")
print(f"Bottom-Left Paper: {bl}")
