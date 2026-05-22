import type { AuthUser } from "./auth";

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
  owner?: CmsPageUser;
  updatedBy?: CmsPageUser;
  createdAt: string;
  updatedAt: string;
};

export type CmsDraftPage = CmsPageRecord & {
  status: "draft";
  // draftにpublishedAtを持たせないことで、公開状態の判定をstatusだけに閉じ込める
  publishedAt?: never;
};

export type CmsPublishedPage = CmsPageRecord & {
  status: "published";
  publishedAt: string;
};

export type CmsPage = CmsDraftPage | CmsPublishedPage;

export type CmsPublishRequest = {
  id: CmsPageId;
};

export type CmsIssueInput = CmsPageInput;
