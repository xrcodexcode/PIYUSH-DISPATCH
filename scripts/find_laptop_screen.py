from PIL import Image

img = Image.open('public/assets/daily-node-11/4.jpg')
w, h = img.size
pixels = img.load()

# Let's find the screen boundaries:
# In the region x in [250, 680], y in [250, 600]
# The MacBook screen bezel is dark gray/black, and the inner screen is bright white (#F8F9FA)
# Let's find top-left, top-right, bottom-right, bottom-left of the bright screen

screen_points = []
for y in range(240, 650):
    for x in range(250, 690):
        r, g, b = pixels[x, y]
        # Check for the white/light gray document screen
        if r > 215 and g > 215 and b > 215:
            screen_points.append((x, y))

if screen_points:
    # Sort points to find corners
    top_left = min(screen_points, key=lambda p: p[0] + p[1])
    top_right = min(screen_points, key=lambda p: -p[0] + p[1])
    bottom_left = min(screen_points, key=lambda p: p[0] - p[1])
    bottom_right = min(screen_points, key=lambda p: -p[0] - p[1])
    print(f"Top-Left: {top_left}")
    print(f"Top-Right: {top_right}")
    print(f"Bottom-Right: {bottom_right}")
    print(f"Bottom-Left: {bottom_left}")
