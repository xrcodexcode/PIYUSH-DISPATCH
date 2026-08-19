from PIL import Image

img = Image.open('public/assets/daily-node-9/4.jpg')
w, h = img.size
pixels = img.load()

# Find dark text pixels (r < 60, g < 60, b < 60) inside the white page area
dark_pixels = []
for y in range(h):
    for x in range(w):
        r, g, b = pixels[x, y]
        if r < 60 and g < 60 and b < 60:
            # Check if surrounding area is white (i.e. on the paper)
            dark_pixels.append((x, y))

print(f"Image size: {w} x {h}")
# Filter dark pixels in the laptop screen region x in [200, 600], y in [250, 700]
screen_dark = [p for p in dark_pixels if 200 < p[0] < 550 and 250 < p[1] < 700]

xs = [p[0] for p in screen_dark]
ys = [p[1] for p in screen_dark]
print(f"Screen text bounds: X=[{min(xs)}, {max(xs)}], Y=[{min(ys)}, {max(ys)}]")

# Find lines of text
for test_y in range(min(ys), max(ys), 20):
    row_xs = [p[0] for p in screen_dark if abs(p[1] - test_y) <= 5]
    if row_xs:
        print(f"Y ~ {test_y}: X in [{min(row_xs)}, {max(row_xs)}]")
