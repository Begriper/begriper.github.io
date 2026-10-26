// Prints the CV pages to A4 PDFs with headless Chrome (same engine as Ctrl+P)
// and checks that each PDF has exactly two pages. Run: `cd tools && npm run pdf`.
// Set CHROME=path/to/chrome if it is not in the default Windows location.
import { createServer } from 'node:http';
import { readFile, readFileSync, mkdtempSync, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const JOBS = [
  ['/print/recepcia-sk/', 'pdf/frantisek-stolar-recepcia-sk.pdf'],
  ...['sk', 'cs', 'pl', 'de', 'en'].map(l => [`/${l}/`, `pdf/frantisek-stolar-cv-${l}.pdf`]),
];
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

// Minimal static server so root-relative URLs (/css/…, /img/…) resolve as on GitHub Pages.
const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (path.endsWith('\\') || path.endsWith('/')) path += 'index.html';
  readFile(join(ROOT, path), (err, body) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }).end(body);
  });
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}`;

const only = process.argv.slice(2);
let failed = false;
for (const [url, out] of JOBS) {
  if (only.length && !only.some(o => out.includes(o))) continue;
  if (!existsSync(join(ROOT, url, 'index.html'))) continue;
  const profile = mkdtempSync(join(tmpdir(), 'cv-pdf-'));
  // async: a blocking call would starve the in-process server Chrome is loading from
  await promisify(execFile)(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`,
    '--no-pdf-header-footer', '--virtual-time-budget=5000', `--print-to-pdf=${join(ROOT, out)}`, base + url,
  ], { timeout: 60000 });
  const pages = (readFileSync(join(ROOT, out), 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  failed ||= pages !== 2;
  console.log(`${pages === 2 ? 'OK  ' : 'FAIL'} ${out}: ${pages} page(s)`);
}
server.close();
process.exit(failed ? 1 : 0);
