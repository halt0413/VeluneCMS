import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type {
  CmsPage,
  ContentCollection,
  ListContentsOptions,
  ReadContentOptions,
  VeluneContentFile
} from "./types.js";
import { canReadContent, filterContents } from "./visibility.js";

const DEFAULT_CONTENT_PATH = ".velune/content.json";

type LoadVeluneContentOptions = {
  contentPath?: string;
};

export async function loadVeluneContent({
  contentPath = DEFAULT_CONTENT_PATH
}: LoadVeluneContentOptions = {}): Promise<VeluneContentFile> {
  const file = await readFile(resolve(contentPath), "utf8");
  const parsed = JSON.parse(file) as VeluneContentFile;

  return {
    collections: parsed.collections ?? [],
    contents: parsed.contents ?? [],
    generatedAt: parsed.generatedAt
  };
}

export function listContents(
  content: VeluneContentFile,
  options: ListContentsOptions = {}
): CmsPage[] {
  return filterContents(content.contents, {
    contentType: options.contentType,
    includeDrafts: options.includeDrafts ?? false
  });
}

export function getContent(
  content: VeluneContentFile,
  id: string,
  options: ReadContentOptions = {}
): CmsPage {
  const item = content.contents.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`VeluneCMS content not found: ${id}`);
  }

  if (!canReadContent(item, {
    includeDrafts: options.includeDrafts ?? false
  })) {
    throw new Error(`VeluneCMS content is not readable: ${id}`);
  }

  return item;
}

export function getContentBySlug(
  content: VeluneContentFile,
  slug: string,
  options: ListContentsOptions = {}
): CmsPage {
  const item = listContents(content, options).find((entry) => entry.slug === slug);

  if (!item) {
    throw new Error(`VeluneCMS content not found: ${slug}`);
  }

  return item;
}

export function listContentCollections(
  content: VeluneContentFile
): ContentCollection[] {
  return content.collections;
}
