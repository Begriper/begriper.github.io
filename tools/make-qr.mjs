// Generates the print-only QR codes as SVG files in img/qr/ and verifies that
// each committed SVG decodes back to its URL. Run once: `cd tools && npm run qr`.
// Error correction M, 4-module quiet zone, dark #172026 on white.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

const OUT = new URL('../img/qr/', import.meta.url);
const QUIET = 4;
const CODES = {
  'web-sk': 'https://frantisek-stolar.cv/sk/',
  'web-cs': 'https://frantisek-stolar.cv/cs/',
  'web-pl': 'https://frantisek-stolar.cv/pl/',
  'web-de': 'https://frantisek-stolar.cv/de/',
  'web-en': 'https://frantisek-stolar.cv/en/',
  linkedin: 'https://linkedin.com/in/frantisek-stolar',
  github: 'https://github.com/Begriper',
};

function toSvg(text) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const n = modules.size;
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!modules.get(y, x)) continue;
      let run = 1;
      while (x + run < n && modules.get(y, x + run)) run++;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x += run - 1;
    }
  }
  const box = n + 2 * QUIET;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-${QUIET} -${QUIET} ${box} ${box}" shape-rendering="crispEdges"><rect x="-${QUIET}" y="-${QUIET}" width="${box}" height="${box}" fill="#fff"/><path fill="#172026" d="${d}"/></svg>\n`;
}

// Rasterise the SVG's own path data (not the encoder output) and decode it.
function decode(svg) {
  const [x0, , box] = svg.match(/viewBox="([-\d]+) ([-\d]+) (\d+) (\d+)"/).slice(1).map(Number);
  const scale = 8;
  const size = box * scale;
  const px = new Uint8ClampedArray(size * size * 4).fill(255);
  const d = svg.match(/ d="([^"]+)"/)[1];
  for (const [, x, y, w] of d.matchAll(/M(\d+) (\d+)h(\d+)/g)) {
    for (let yy = 0; yy < scale; yy++) {
      for (let xx = 0; xx < Number(w) * scale; xx++) {
        const i = (((Number(y) - x0) * scale + yy) * size + (Number(x) - x0) * scale + xx) * 4;
        px[i] = 0x17; px[i + 1] = 0x20; px[i + 2] = 0x26;
      }
    }
  }
  return jsQR(px, size, size)?.data;
}

mkdirSync(OUT, { recursive: true });
let failed = false;
for (const [name, url] of Object.entries(CODES)) {
  const file = new URL(`${name}.svg`, OUT);
  writeFileSync(file, toSvg(url));
  const got = decode(readFileSync(file, 'utf8'));
  const ok = got === url;
  failed ||= !ok;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}.svg -> ${got}`);
}
process.exit(failed ? 1 : 0);
