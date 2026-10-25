# Inter 4.1

Source: https://github.com/rsms/inter/tree/v4.1/docs/font-files
License: SIL Open Font License 1.1; see LICENSE.txt.

Local static WOFF2 weights: Regular (400), Medium (500), SemiBold (600), Bold (700).
No external font service or installed system font is required.

These copies have one modification: optional private-use Unicode aliases were
removed from their cmap tables. Chromium otherwise maps tabular numerals and
contextual punctuation to private-use characters when exporting to PDF.
Outlines, glyphs, spacing, kerning and OpenType features remain unchanged.

Reproduce with Python and fonttools[woff] 4.65.0, brotli 1.2.0:

    python scripts/prepare_inter.py ORIGINAL_FONT_DIRECTORY fonts/inter

Normal site builds simply copy these prepared assets; Python is not required.
