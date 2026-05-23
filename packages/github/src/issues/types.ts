export type CmsPageIssueInput = {
  slug: string;
  title: string;
  body: string;
  status: "draft" | "published";
};
