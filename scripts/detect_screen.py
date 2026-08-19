from PIL import Image

img = Image.open('public/assets/daily-node-11/4.jpg')
w, h = img.size

pixels = img.load()
white_pixels = []

for y in range(h):
    for x in range(w):
        r, g, b = pixels[x, y]
        if r > 210 and g > 210 and b > 210:
            white_pixels.append((x, y))

if white_pixels:
    xs = [p[0] for p in white_pixels]
    ys = [p[1] for p in white_pixels]
    print(f"White bounds: X=[{min(xs)}, {max(xs)}], Y=[{min(ys)}, {max(ys)}]")
    print(f"Total white pixels: {len(white_pixels)}")
