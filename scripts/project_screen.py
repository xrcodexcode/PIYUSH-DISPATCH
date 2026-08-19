from PIL import Image, ImageFilter, ImageDraw

def find_coeffs(pa, pb):
    """
    Find coefficients for perspective transform from pa to pb.
    pa: destination quad [(x0, y0), (x1, y1), (x2, y2), (x3, y3)]
    pb: source rect [(u0, v0), (u1, v1), (u2, v2), (u3, v3)]
    """
    matrix = []
    for p1, p2 in zip(pa, pb):
        matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0]*p1[0], -p2[0]*p1[1]])
        matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1]*p1[0], -p2[1]*p1[1]])

    A = []
    B = []
    for p1, p2 in zip(pa, pb):
        A.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0]*p1[0], -p2[0]*p1[1]])
        A.append([0, 0, 0, p1[0], p1[1], 1, -p2[1]*p1[0], -p2[1]*p1[1]])
        B.append(p2[0])
        B.append(p2[1])

    # Pure Python Gaussian elimination / solver for 8x8 system
    coeffs = solve_linear_system(A, B)
    return coeffs

def solve_linear_system(A, B):
    n = len(B)
    # Augmented matrix
    M = [A[i] + [B[i]] for i in range(n)]

    for i in range(n):
        # Pivot
        max_row = i
        for k in range(i + 1, n):
            if abs(M[k][i]) > abs(M[max_row][i]):
                max_row = k
        M[i], M[max_row] = M[max_row], M[i]

        pivot = M[i][i]
        if abs(pivot) < 1e-12:
            continue
        for j in range(i, n + 1):
            M[i][j] /= pivot

        for k in range(n):
            if k != i:
                factor = M[k][i]
                for j in range(i, n + 1):
                    M[k][j] -= factor * M[i][j]

    return [M[i][n] for i in range(n)]

# Load base image and generated document
base = Image.open('public/assets/daily-node-11/4.jpg').convert('RGBA')
w, h = base.size

doc = Image.open('doc_preview.png').convert('RGBA')
doc_w, doc_h = doc.size

# Exact corner coordinates of the MacBook Pro inner display quad:
# Top-Left: (283, 274)
# Top-Right: (675, 303)
# Bottom-Right: (572, 706)
# Bottom-Left: (289, 642)
dest_quad = [(283, 274), (675, 303), (572, 706), (289, 642)]
src_rect = [(0, 0), (doc_w, 0), (doc_w, doc_h), (0, doc_h)]

coeffs = find_coeffs(dest_quad, src_rect)

# Transform document onto full frame
warped = doc.transform((w, h), Image.PERSPECTIVE, coeffs, Image.BICUBIC)

# Create a mask for smooth compositing
mask = Image.new('L', (w, h), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.polygon(dest_quad, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.0))

# Composite warped screen over base image
result = Image.composite(warped, base, mask)

# Save result to 4.jpg
result.convert('RGB').save('public/assets/daily-node-11/4.jpg', quality=98)
print("Updated 4.jpg with crystal-clear 20 Aug tech briefing screen!")
