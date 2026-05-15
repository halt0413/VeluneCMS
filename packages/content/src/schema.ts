import { z } from "zod";
import type { CmsPageInput } from "@repo/types";

export const cmsPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  contentType: z.string().min(1),
  status: z.enum(["draft", "published"])
});

export type CmsPageSchema = z.infer<typeof cmsPageSchema>;

const _cmsPageInputCheck: CmsPageInput = {} as CmsPageSchema;
void _cmsPageInputCheck;
