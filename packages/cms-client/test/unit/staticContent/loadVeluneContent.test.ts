import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadVeluneContent } from "../../../src/content/staticContent.js";

describe("loadVeluneContent", () => {
  it("content JSONを読み込み、配列がなければ空配列で補完する", async () => {
    const directory = await mkdtemp(join(tmpdir(), "velune-cms-client-"));
    const contentPath = join(directory, "content.json");

    try {
      await writeFile(
        contentPath,
        JSON.stringify({ generatedAt: "2026-01-07T00:00:00.000Z" })
      );

      await expect(loadVeluneContent({ contentPath })).resolves.toEqual({
        collections: [],
        contents: [],
        generatedAt: "2026-01-07T00:00:00.000Z"
      });
    } finally {
      await rm(directory, { force: true, recursive: true });
    }
  });
});
