import {
  getContent,
  getContentBySlug,
  listContentCollections,
  listContents,
  loadVeluneContent
} from "../content/staticContent.js";
import type {
  GetContentOptions,
  ListContentsOptions,
  StaticVeluneClient,
  VeluneClientConfig
} from "./types.js";

export function createVeluneClient({
  contentPath,
  defaultIncludeDrafts = false
}: VeluneClientConfig = {}): StaticVeluneClient {
  return {
    async getContent(id: string, options: GetContentOptions = {}) {
      const content = await loadVeluneContent({ contentPath });
      return getContent(content, id, {
        includeDrafts: options.includeDrafts ?? defaultIncludeDrafts
      });
    },
    async getContentBySlug(slug: string, options: ListContentsOptions = {}) {
      const content = await loadVeluneContent({ contentPath });
      return getContentBySlug(content, slug, {
        contentType: options.contentType,
        includeDrafts: options.includeDrafts ?? defaultIncludeDrafts
      });
    },
    async listContentCollections() {
      const content = await loadVeluneContent({ contentPath });
      return listContentCollections(content);
    },
    async listContents(options: ListContentsOptions = {}) {
      const content = await loadVeluneContent({ contentPath });
      return listContents(content, {
        contentType: options.contentType,
        includeDrafts: options.includeDrafts ?? defaultIncludeDrafts
      });
    }
  };
}
