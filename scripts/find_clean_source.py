import os
from PIL import Image

for root, dirs, files in os.walk('public/assets'):
    for f in files:
        if f.endswith('4.jpg') or f.endswith('.jpg'):
            p = os.path.join(root, f)
            try:
                img = Image.open(p)
                # Check if this image has the desk scene (dimensions 1376x768 or similar)
                if img.size == (1376, 768):
                    # Check pixel at (200, 500) - in the bad image it was white (244, 245, 246)
                    # in pristine it is dark wood or background
                    r, g, b = img.convert('RGB').getpixel((200, 500))
                    print(f"File: {p}, Pixel at (200, 500): RGB({r},{g},{b})")
            except Exception:
                pass
