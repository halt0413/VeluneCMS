import type { CmsPage } from "@repo/types";

export type Content = CmsPage;

export function toContent(page: CmsPage): Content {
  // 今はAPI型と画面domain型が同じだが、将来の表示用整形はこの境界で吸収する
  return page;
}
