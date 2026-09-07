#!/usr/bin/env node
// Scans content/**/*.md for [[wikilink]] targets and verifies each resolves to an existing file slug.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, 'content');

function listMd(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return listMd(p);
    return e.name.endsWith('.md') ? [p] : [];
  });
}

const files = listMd(ROOT);
// slugs: full path without ext, plus basename without ext (for shortest resolution)
const slugs = new Set();
const baseNames = new Map(); // basename -> [fullPaths]
for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/').replace(/\.md$/, '');
  slugs.add(rel);
  const base = path.basename(rel);
  if (!baseNames.has(base)) baseNames.set(base, []);
  baseNames.get(base).push(rel);
}

let broken = 0;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f).replace(/\\/g, '/').replace(/\.md$/, '');
  const targets = [...text.matchAll(/\[\[([^\]|#]+)(?:\|([^\]]*))?\]\]/g)].map((m) => m[1].trim());
  for (const t of targets) {
    let ok = slugs.has(t);
    if (!ok) {
      // shortest: try basename match
      const cands = baseNames.get(t) || [];
      if (cands.length >= 1) ok = true;
    }
    if (!ok) {
      console.error(`BROKEN in ${rel}: [[${t}]]`);
      broken++;
    }
  }
}
console.log(broken === 0 ? 'OK: all wikilinks resolve' : `${broken} broken link(s)`);
process.exit(broken === 0 ? 0 : 1);
