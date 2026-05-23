import type {
  ContentCollectionCreateResponse,
  ContentCollectionListResponse
} from "../contracts";
import type { Context } from "hono";
import type { ContentCollectionsControllerHandlers } from "../types";

export function createContentCollectionsController({
  createContentCollection,
  listContentCollections
}: ContentCollectionsControllerHandlers) {
  return {
    async create(c: Context) {
      const payload = await c.req.json();
      const created = await createContentCollection(payload);
      const response: ContentCollectionCreateResponse = {
        created
      };

      return c.json(response, 201);
    },
    async list(c: Context) {
      const items = await listContentCollections();
      const response: ContentCollectionListResponse = {
        items,
        total: items.length
      };

      return c.json(response);
    }
  };
}
