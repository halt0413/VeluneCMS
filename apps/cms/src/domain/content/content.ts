import type { CmsPage } from "@repo/types";

export type Content = CmsPage;

export function toContent(page: CmsPage): Content {
  return page;
}
