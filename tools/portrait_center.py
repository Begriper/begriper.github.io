"""Make img/portrait-cv.jpg: the portrait framed like the Google account photo.

The source (480x480) has the head at x=254, right of centre. This takes a
480px square centred on the head (x 14..494) and pads the 14 px past the right
edge with black, matching the photo's own black side strip. Nothing else changes.
Usage: python tools/portrait_center.py img/portrait.jpg img/portrait-cv.jpg
"""
import sys
from PIL import Image

HEAD_X, SIZE = 254, 480
src = Image.open(sys.argv[1]).convert("RGB")
left = HEAD_X - SIZE // 2
out = Image.new("RGB", (SIZE, SIZE), (0, 0, 0))
out.paste(src, (-left, 0))
out.save(sys.argv[2], quality=92)
