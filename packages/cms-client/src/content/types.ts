export type CmsContentStatus = "draft" | "published";

export type CmsPageUser = {
  id: number;
  login: string;
};

export type CmsPageBase = {
  body: string;
  contentType: string;
  createdAt: string;
  createdBy?: CmsPageUser;
  id: string;
  owner?: CmsPageUser;
  slug: string;
  title: string;
  updatedAt: string;
  updatedBy?: CmsPageUser;
};

export type CmsDraftPage = CmsPageBase & {
  publishedAt?: never;
  status: "draft";
};

export type CmsPublishedPage = CmsPageBase & {
  publishedAt: string;
  status: "published";
};

export type CmsPage = CmsDraftPage | CmsPublishedPage;

export type ListContentsOptions = {
  contentType?: string;
  includeDrafts?: boolean;
};

export type GetContentOptions = {
  includeDrafts?: boolean;
};

export type ContentClient = {
  getContent(id: string, options?: GetContentOptions): Promise<CmsPage | null>;
  getContentBySlug(
    slug: string,
    options?: ListContentsOptions
  ): Promise<CmsPage | null>;
  listContents(options?: ListContentsOptions): Promise<CmsPage[]>;
};

export type CmsPageItemResponse = {
  item: CmsPage;
};

export type CmsPageListResponse = {
  items: CmsPage[];
  total: number;
};
