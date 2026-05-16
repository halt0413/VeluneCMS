import type { AuthUser } from "./auth";

// ページまわりで使うDomainType
export type CmsContentStatus = "draft" | "published";

export type CmsPageId = string;

export type CmsPageUser = Pick<AuthUser, "id" | "login">;

export type CmsPageInput = {
  slug: string;
  title: string;
  body: string;
  contentType: string;
  status: CmsContentStatus;
};

export type CmsPagePatch = Partial<CmsPageInput>;

export type CmsPageRecord = CmsPageInput & {
  createdBy?: CmsPageUser;
  id: CmsPageId;
  updatedBy?: CmsPageUser;
  createdAt: string;
  updatedAt: string;
};

export type CmsDraftPage = CmsPageRecord & {
  status: "draft";
  publishedAt?: never;
};

export type CmsPublishedPage = CmsPageRecord & {
  status: "published";
  publishedAt: string;
};

export type CmsPage = CmsDraftPage | CmsPublishedPage;

export type PublicContent = Pick<CmsPageInput, "slug" | "title" | "body">;

export type ContentPreview = PublicContent & {
  mode: "preview";
};

export type PublishedContent = PublicContent &
  Pick<CmsPublishedPage, "publishedAt">;
