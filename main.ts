// vacuum-excuse-01: writes one robot-vacuum excuse to /output/entry.txt
// Gate: UTF-8 text, 1-140 characters, single line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "I didn't miss that spot. My map says it's a wall, and I trust my map more than your eyes.";

function checkEntry(text: string): void {
  // Count characters as Unicode code points, not UTF-16 code units,
  // so the 1-140 gate matches what the bounty counts.
  const charCount = [...text].length;
  if (charCount < 1 || charCount > 140) {
    throw new Error(`entry must be 1-140 characters, got ${charCount}`);
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
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f) {
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
