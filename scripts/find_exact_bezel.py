from PIL import Image

img = Image.open('public/assets/daily-node-11/4.jpg')
pixels = img.load()
w, h = img.size

# Let's find rows where the screen is located
# The screen is between x: [200, 560] and y: [260, 700]

screen_pixels = []
for y in range(250, 710):
    for x in range(190, 560):
        r, g, b = pixels[x, y]
        # White document on laptop screen
        if r > 200 and g > 200 and b > 200:
            screen_pixels.append((x, y))

# Find the 4 outer corners
# Top-Left: min(x) at top y
top_points = sorted([p for p in screen_pixels if p[1] < 320], key=lambda p: p[0])
tl = top_points[0]
tr = top_points[-1]

bottom_points = sorted([p for p in screen_pixels if p[1] > 600], key=lambda p: p[0])
bl = bottom_points[0]
br = bottom_points[-1]

print(f"Top-Left Screen Corner: {tl}")
print(f"Top-Right Screen Corner: {tr}")
print(f"Bottom-Left Screen Corner: {bl}")
print(f"Bottom-Right Screen Corner: {br}")
