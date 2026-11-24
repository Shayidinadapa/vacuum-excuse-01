// vacuum-excuse-01: writes one robot-vacuum excuse to /output/entry.txt
// Gate: UTF-8 text, 1-140 characters, single line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "I didn't miss that spot. My map says it's a wall, and I trust my map more than your eyes.";

function checkEntry(text: string): void {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must have no leading or trailing whitespace");
  }
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
      throw new Error("entry must not contain control characters");
    }
  }
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

checkEntry(EXCUSE);
writeFileSync(outPath, EXCUSE, "utf8");

// Read back and verify byte-for-byte.
const back = readFileSync(outPath, "utf8");
if (back !== EXCUSE) {
  throw new Error("entry.txt read-back mismatch");
}
checkEntry(back);
console.log(`wrote ${outPath} (${EXCUSE.length} chars)`);
