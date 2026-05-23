import { z } from "zod";
import type { CmsPageInput } from "./types";

export const cmsPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  contentType: z.string().min(1),
  status: z.enum(["draft", "published"])
});

export type CmsPageSchema = z.infer<typeof cmsPageSchema>;

// zod schemaと共有型がズレたらTypeScript上で検知するための型チェック専用代入
const _cmsPageInputCheck: CmsPageInput = {} as CmsPageSchema;
void _cmsPageInputCheck;
