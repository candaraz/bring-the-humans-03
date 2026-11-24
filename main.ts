// main.ts — bring-the-humans-03 entrypoint.
// Reads VIDEO.json (the posted TikTok URL) and copies it, unchanged,
// into the grader output directory. Node 22, ESM, stdlib only.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '.';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? 'out';

const videoPath = join(botDir, 'VIDEO.json');
const tiktokPattern = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._-]+\/video\/[0-9]+$/;

function abort(reason) {
  console.error(`main.ts: ${reason}`);
  process.exit(1);
}

let text;
try {
  text = await readFile(videoPath, 'utf8');
} catch (err) {
  abort(`cannot read ${videoPath}: ${err.message}`);
}

let doc;
try {
  doc = JSON.parse(text);
} catch (err) {
  abort(`VIDEO.json is not valid JSON: ${err.message}`);
}

if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) {
  abort('VIDEO.json must be a JSON object');
}

if (typeof doc.url !== 'string') {
  abort('VIDEO.json must contain a "url" string');
}

if (!tiktokPattern.test(doc.url)) {
  abort(
    `"url" must be a full TikTok video URL, ` +
      `like https://www.tiktok.com/@handle/video/1234567890123456789, ` +
      `got: ${doc.url}`,
  );
}

const destPath = join(outDir, 'VIDEO.json');

try {
  await mkdir(outDir, { recursive: true });
  await writeFile(destPath, text, 'utf8');
} catch (err) {
  abort(`cannot write output VIDEO.json: ${err.message}`);
}

// Read the copy back and confirm it matches the source byte-for-byte,
// so a partial or altered write is caught instead of silently passing.
let copied;
try {
  copied = await readFile(destPath, 'utf8');
} catch (err) {
  abort(`cannot re-read ${destPath}: ${err.message}`);
}

if (copied !== text) {
  abort('output VIDEO.json does not match the source byte-for-byte');
}
