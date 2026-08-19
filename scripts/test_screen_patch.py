from PIL import Image, ImageDraw

# Load pristine original from git HEAD
img = Image.open('public/assets/daily-node-9/4.jpg').convert('RGBA')

# Screen background color
bg_color = (246, 246, 246, 255)
draw = ImageDraw.Draw(img)

# Clear the body text region on the laptop screen
poly_clear = [
    (340, 360),
    (650, 335),
    (650, 610),
    (340, 660)
]

draw.polygon(poly_clear, fill=bg_color, outline=(0, 255, 0))

img.save('screen_patch_test.png')
print("Saved screen_patch_test.png")
