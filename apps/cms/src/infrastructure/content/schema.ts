import { z } from "zod";

export const cmsContentStatusSchema = z.enum(["draft", "published"]);

export const cmsPageUserSchema = z.object({
  id: z.number(),
  login: z.string()
});

export const cmsPageInputSchema = z.object({
  body: z.string().min(1, "本文を入力してください"),
  contentType: z.string().min(1, "種別を入力してください"),
  slug: z.string().min(1, "slugを入力してください"),
  status: cmsContentStatusSchema,
  title: z.string().min(1, "タイトルを入力してください")
});

export const cmsPagePatchSchema = cmsPageInputSchema.partial();

const cmsPageBaseSchema = cmsPageInputSchema.extend({
  createdAt: z.string(),
  createdBy: cmsPageUserSchema.optional(),
  id: z.string(),
  owner: cmsPageUserSchema.optional(),
  updatedAt: z.string(),
  updatedBy: cmsPageUserSchema.optional()
});

export const cmsPageResourceSchema = z.discriminatedUnion("status", [
  cmsPageBaseSchema.extend({
    publishedAt: z.never().optional(),
    status: z.literal("draft")
  }),
  cmsPageBaseSchema.extend({
    publishedAt: z.string(),
    status: z.literal("published")
  })
]);

export const cmsPageCreateResponseSchema = z.object({
  created: cmsPageResourceSchema
});

export const cmsPageUpdateResponseSchema = z.object({
  updated: cmsPageResourceSchema
});

export const cmsPageDeleteResponseSchema = z.object({
  deleted: z.literal(true),
  id: z.string()
});

export const cmsPageItemResponseSchema = z.object({
  item: cmsPageResourceSchema
});

export const cmsPageListResponseSchema = z.object({
  items: z.array(cmsPageResourceSchema),
  total: z.number()
});
