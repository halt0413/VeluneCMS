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

type SchemaMatchesInput =
  CmsPageSchema extends CmsPageInput
    ? CmsPageInput extends CmsPageSchema
      ? true
      : never
    : never;

const _schemaMatchesInput: SchemaMatchesInput = true;
void _schemaMatchesInput;
