import { toPublicContent } from "./publicContent";
import { cmsPageSchema } from "./schema";
import type { CmsPageInput, PublicContent } from "./types";

export function toPageContent(input: CmsPageInput): PublicContent {
  // previewなど公開面に渡す前に、CMS入力として正しいshapeかをここで再検証する
  return toPublicContent(cmsPageSchema.parse(input));
}
