import type { CmsPage } from "@repo/types";

export type Content = CmsPage & {
  contentType: string;
};

export function toContent(page: CmsPage): Content {
  return {
    ...page,
    contentType: "content"
  };
}
