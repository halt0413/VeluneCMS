import type { CmsPageInput, PublicContent } from "@repo/types";
import { toPublicContent } from "@repo/utils";
import { cmsPageSchema } from "./schema";

export function toPageContent(input: CmsPageInput): PublicContent {
  // previewなど公開面に渡す前に、CMS入力として正しいshapeかをここで再検証する
  return toPublicContent(cmsPageSchema.parse(input));
}
