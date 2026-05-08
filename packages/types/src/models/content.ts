import type { CmsPageInput, CmsPublishedPage } from "./cms";

export type PublicContent = Pick<CmsPageInput, "slug" | "title" | "body">;

export type ContentPreview = PublicContent & {
  mode: "preview";
};

export type PublishedContent = PublicContent &
  Pick<CmsPublishedPage, "publishedAt">;
