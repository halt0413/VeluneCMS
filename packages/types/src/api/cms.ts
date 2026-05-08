import type { CmsPage, CmsPageInput, CmsPagePatch } from "../models/cms";
import type { PublicContent } from "../models/content";
import type { GitHubIssueCreateResult } from "../models/github";
import type { ApiItemResponse, ApiListResponse } from "./common";

export type CmsPageCreateRequest = CmsPageInput;

export type CmsPageCreateResponse = {
  created: CmsPage;
};

export type CmsPageUpdateRequest = CmsPagePatch;

export type CmsPageUpdateResponse = {
  updated: CmsPage;
};

export type CmsPageDeleteResponse = {
  deleted: true;
  id: CmsPage["id"];
};

export type CmsPageListResponse = ApiListResponse<CmsPage>;

export type PreviewResponse = {
  slug: string;
  status: "preview";
};

export type CmsPreviewResponse = PreviewResponse & {
  content: PublicContent;
};

export type GitHubSyncResponse = {
  synced: {
    pageId: CmsPage["id"];
    issue: GitHubIssueCreateResult;
  };
};

export type CmsPageItemResponse = ApiItemResponse<CmsPage>;
