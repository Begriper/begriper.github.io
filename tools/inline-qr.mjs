// Inlines the committed QR SVGs (img/qr/*.svg) into pages, in place of
// <svg data-qr="NAME" aria-label="…">…</svg>. Idempotent; run after `npm run qr`.
// Usage: node inline-qr.mjs ../sk/index.html ../print/recepcia-sk/index.html
import { readFileSync, writeFileSync } from 'node:fs';

const qrDir = new URL('../img/qr/', import.meta.url);
for (const page of process.argv.slice(2)) {
  let html = readFileSync(page, 'utf8');
  let count = 0;
  html = html.replace(/<svg data-qr="([\w-]+)"[^>]*?aria-label="([^"]*)"[^>]*>[\s\S]*?<\/svg>/g, (_, name, label) => {
    count++;
    const svg = readFileSync(new URL(`${name}.svg`, qrDir), 'utf8').trim();
    return svg.replace('<svg xmlns="http://www.w3.org/2000/svg"', `<svg data-qr="${name}" aria-label="${label}" role="img"`);
  });
  writeFileSync(page, html);
  console.log(`${page}: ${count} QR code(s)`);
}
