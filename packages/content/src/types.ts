export type CmsContentStatus = "draft" | "published";

export type CmsPageInput = {
  slug: string;
  title: string;
  body: string;
  contentType: string;
  status: CmsContentStatus;
};

export type PublicContent = Pick<CmsPageInput, "slug" | "title" | "body">;
