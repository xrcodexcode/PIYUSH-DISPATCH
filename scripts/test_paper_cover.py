from PIL import Image, ImageDraw

img = Image.open('public/assets/deep-node-1/macbook_briefing.jpg').convert('RGBA')
draw = ImageDraw.Draw(img)

# Shifted display quad:
poly_clear = [
    (350, 275),
    (665, 260),
    (705, 618),
    (330, 710)
]

draw.polygon(poly_clear, fill=(246, 246, 246, 255), outline=(0, 255, 0))

img.save('test_paper_cover.png')
print("Saved shifted test_paper_cover.png")
