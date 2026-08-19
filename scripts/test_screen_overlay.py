from PIL import Image, ImageDraw

img = Image.open('public/assets/daily-node-11/4.jpg').convert('RGBA')
draw = ImageDraw.Draw(img)

candidates = {
    'TL': (205, 290),
    'TR': (670, 265),
    'BR': (705, 620),
    'BL': (328, 712)
}

for name, pt in candidates.items():
    draw.ellipse([(pt[0]-4, pt[1]-4), (pt[0]+4, pt[1]+4)], fill=(0, 255, 0), outline=(255, 255, 255))
    draw.text((pt[0]+6, pt[1]), name, fill=(0, 255, 0))

draw.polygon([candidates['TL'], candidates['TR'], candidates['BR'], candidates['BL']], outline=(0, 255, 0), width=2)

img.save('debug_corners.png')
print("Saved exact screen debug_corners.png")
