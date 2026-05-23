import { normalizeSlug } from "@repo/utils";
import type { CmsPageInput, PublicContent } from "./types";

export function toPublicContent(input: CmsPageInput): PublicContent {
  return {
    slug: normalizeSlug(input.slug),
    title: input.title.trim(),
    body: input.body.trim()
  };
}
