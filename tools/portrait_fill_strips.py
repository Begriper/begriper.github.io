"""Fill the black side strips of the portrait by extending the neighbouring background."""
import sys
import numpy as np
from PIL import Image, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
LEFT_END, RIGHT_START = 33, 428  # first/last real columns (measured)
a = np.asarray(Image.open(SRC).convert("RGB"), dtype=float)
h = a.shape[0]
left = np.median(a[:, LEFT_END:LEFT_END + 4], axis=1)          # door frame / wall next to strip
right = np.median(a[:, RIGHT_START - 10:RIGHT_START - 4], axis=1)  # dark wall next to strip
dark = np.median(a[20:300, RIGHT_START - 10:RIGHT_START - 4].reshape(-1, 3), axis=0)
right[right.mean(axis=1) > 40] = dark  # the elbow touches the edge: keep wall colour there
k = np.ones(9) / 9
for col in (left, right):
    for c in range(3):
        col[:, c] = np.convolve(np.pad(col[:, c], 4, mode="edge"), k, mode="valid")
out = a.copy()
out[:, :LEFT_END] = left[:, None, :]
out[:, RIGHT_START:] = right[:, None, :]
# soften the seams a little, only inside the filled bands
img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
blur = np.asarray(img.filter(ImageFilter.GaussianBlur(1.2)), dtype=float)
for x0, x1 in ((0, LEFT_END + 2), (RIGHT_START - 2, a.shape[1])):
    out[:, x0:x1] = blur[:, x0:x1]
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(OUT, quality=92)
