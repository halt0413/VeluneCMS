import { z } from "zod";

export const contentCollectionInputSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  slug: z.string().min(1, "slugを入力してください")
});

export const contentCollectionPatchSchema =
  contentCollectionInputSchema.partial();

export const contentCollectionResourceSchema = contentCollectionInputSchema.extend(
  {
    createdAt: z.string(),
    id: z.string(),
    updatedAt: z.string()
  }
);

export const contentCollectionCreateResponseSchema = z.object({
  created: contentCollectionResourceSchema
});

export const contentCollectionUpdateResponseSchema = z.object({
  updated: contentCollectionResourceSchema
});

export const contentCollectionDeleteResponseSchema = z.object({
  deleted: z.literal(true),
  id: z.string()
});

export const contentCollectionItemResponseSchema = z.object({
  item: contentCollectionResourceSchema
});

export const contentCollectionListResponseSchema = z.object({
  items: z.array(contentCollectionResourceSchema),
  total: z.number()
});
