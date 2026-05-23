export type CmsContentStatus = "draft" | "published";

export type CmsPageUser = {
  id: number;
  login: string;
};

export type CmsPageInput = {
  slug: string;
  title: string;
  body: string;
  contentType: string;
  status: CmsContentStatus;
};

export type CmsPagePatch = Partial<CmsPageInput>;

type CmsPageBase = CmsPageInput & {
  createdBy?: CmsPageUser;
  id: string;
  owner?: CmsPageUser;
  updatedBy?: CmsPageUser;
  createdAt: string;
  updatedAt: string;
};

export type CmsDraftPage = CmsPageBase & {
  status: "draft";
  publishedAt?: never;
};

export type CmsPublishedPage = CmsPageBase & {
  status: "published";
  publishedAt: string;
};

export type CmsPageResource = CmsDraftPage | CmsPublishedPage;

export type CmsPageCreateRequest = CmsPageInput;

export type CmsPageCreateResponse = {
  created: CmsPageResource;
};

export type CmsPageUpdateRequest = CmsPagePatch;

export type CmsPageUpdateResponse = {
  updated: CmsPageResource;
};

export type CmsPageDeleteResponse = {
  deleted: true;
  id: string;
};

export type CmsPageItemResponse = {
  item: CmsPageResource;
};

export type CmsPageListResponse = {
  items: CmsPageResource[];
  total: number;
};
