import type {
  ContentCollectionDeleteResponse,
  ContentCollectionCreateResponse,
  ContentCollectionItemResponse,
  ContentCollectionListResponse,
  ContentCollectionUpdateResponse
} from "../contracts";
import type { Context } from "hono";
import { z } from "zod";
import { requireRouteParam } from "../params";
import type { ContentCollectionsControllerHandlers } from "../types";

const contentCollectionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1)
});

const contentCollectionPatchSchema = contentCollectionSchema.partial();

export function createContentCollectionsController({
  createContentCollection,
  deleteContentCollection,
  getContentCollection,
  updateContentCollection,
  listContentCollections
}: ContentCollectionsControllerHandlers) {
  return {
    async create(c: Context) {
      const payload = await c.req.json();
      const created = await createContentCollection(
        contentCollectionSchema.parse(payload)
      );
      const response: ContentCollectionCreateResponse = {
        created
      };

      return c.json(response, 201);
    },
    async get(c: Context) {
      const item = await getContentCollection(requireRouteParam(c, "id"));
      const response: ContentCollectionItemResponse = {
        item
      };

      return c.json(response);
    },
    async update(c: Context) {
      const payload = await c.req.json();
      const updated = await updateContentCollection(
        requireRouteParam(c, "id"),
        contentCollectionPatchSchema.parse(payload)
      );
      const response: ContentCollectionUpdateResponse = {
        updated
      };

      return c.json(response);
    },
    async remove(c: Context) {
      const response: ContentCollectionDeleteResponse =
        await deleteContentCollection(requireRouteParam(c, "id"));

      return c.json(response);
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
