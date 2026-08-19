from PIL import Image, ImageDraw

img = Image.open('public/assets/deep-node-1/macbook_briefing.jpg').convert('RGBA')
draw = ImageDraw.Draw(img)

# Exact text area on the document
poly_clear = [
    (335, 305),
    (655, 290),
    (680, 640),
    (370, 675)
]

draw.polygon(poly_clear, fill=(246, 246, 246, 255), outline=(0, 255, 0))

img.save('test_paper_cover.png')
print("Saved exact text quad test_paper_cover.png")
