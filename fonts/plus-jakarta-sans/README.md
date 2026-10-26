# Plus Jakarta Sans

Source: npm package `@fontsource/plus-jakarta-sans` 5.2.8 (Google Fonts build of
https://github.com/tokotype/PlusJakartaSans).
License: SIL Open Font License 1.1; see LICENSE.txt.

Static WOFF2, weights 400/500/600/700/800, unmodified. Two subsets per weight,
selected with `unicode-range` in `css/cv.css`:

- `latin` – basic Latin, Latin-1 (German umlauts, ß), general punctuation (– · ’)
- `latin-ext` – Slovak, Czech and Polish diacritics (č ď ľ ĺ ň ŕ š ť ž ą ę ł ń ś ź ż …)

Neither subset has U+2082 (subscript two), so the pages write `CO<sub>2</sub>`.
Neither subset maps private-use code points, so Chromium PDF export keeps text searchable.

Reproduce: `cd tools && npm install`, then copy
`node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-{latin,latin-ext}-{400..800}-normal.woff2`
to `fonts/plus-jakarta-sans/PlusJakartaSans-{subset}-{weight}.woff2`.
