export type CmsContentStatus = "draft" | "published";

export type CmsPageId = string;

export type CmsPageInput = {
  slug: string;
  title: string;
  body: string;
  status: CmsContentStatus;
};

export type CmsPagePatch = Partial<CmsPageInput>;

export type CmsPageRecord = CmsPageInput & {
  id: CmsPageId;
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

export type CmsPublishRequest = {
  id: CmsPageId;
};

export type CmsIssueInput = CmsPageInput;
