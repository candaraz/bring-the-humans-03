import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// The whole entry: hand the house the TikTok video's address.
// MAKEFUN_BOT_DIR is the repository root; MAKEFUN_OUTPUT_DIR is /output.
const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const source = join(botDir, "VIDEO.json");
const text = await readFile(source, "utf8");

// Refuse to hand over a malformed address file instead of copying garbage.
const parsed = JSON.parse(text);
if (typeof parsed !== "object" || parsed === null || typeof parsed.url !== "string") {
  throw new Error("VIDEO.json must be an object with a url string");
}

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "VIDEO.json"), text);
