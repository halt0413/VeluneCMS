import type { z } from "zod";
import type {
  contentCollectionCreateResponseSchema,
  contentCollectionDeleteResponseSchema,
  contentCollectionInputSchema,
  contentCollectionItemResponseSchema,
  contentCollectionListResponseSchema,
  contentCollectionPatchSchema,
  contentCollectionResourceSchema,
  contentCollectionUpdateResponseSchema
} from "./schema";

export type ContentCollectionResource = z.infer<
  typeof contentCollectionResourceSchema
>;

export type ContentCollectionCreateRequest = z.infer<
  typeof contentCollectionInputSchema
>;

export type ContentCollectionUpdateRequest = z.infer<
  typeof contentCollectionPatchSchema
>;

export type ContentCollectionCreateResponse = z.infer<
  typeof contentCollectionCreateResponseSchema
>;

export type ContentCollectionUpdateResponse = z.infer<
  typeof contentCollectionUpdateResponseSchema
>;

export type ContentCollectionDeleteResponse = z.infer<
  typeof contentCollectionDeleteResponseSchema
>;

export type ContentCollectionItemResponse = z.infer<
  typeof contentCollectionItemResponseSchema
>;

export type ContentCollectionListResponse = z.infer<
  typeof contentCollectionListResponseSchema
>;
