import type {
  ContentCollection,
  ContentCollectionInput,
  LogoutResponse
} from "@repo/types";
import type { CompleteGitHubLoginResult } from "../usecase/auth";
import type { PagePreview, SyncPageToGitHubResult } from "../usecase/page";
import type {
  AuthUser,
  CmsPage,
  CmsPageInput,
  CmsPagePatch,
  GitHubIssue,
  GitHubIssueInput,
  GitHubIssueLabel,
  GitHubIssueUpdateInput
} from "../domain";

export type AuthControllerHandlers = {
  completeGitHubLogin: (input: {
    code?: string;
    state?: string;
  }) => Promise<CompleteGitHubLoginResult>;
  logout: (sessionId: string | undefined) => LogoutResponse;
  startGitHubLogin: (redirectTo: string | undefined) => {
    authorizationUrl: string;
  };
};

export type ContentsControllerHandlers = {
  createContent: (payload: CmsPageInput) => Promise<CmsPage>;
  deleteContent: (id: string) => Promise<{
    deleted: true;
    id: string;
  }>;
  getContent: (id: string) => Promise<CmsPage>;
  getContentPreviewById: (id: string) => Promise<PagePreview>;
  listContents: () => Promise<CmsPage[]>;
  updateContent: (id: string, payload: CmsPagePatch) => Promise<CmsPage>;
};

export type ContentCollectionsControllerHandlers = {
  createContentCollection: (
    payload: ContentCollectionInput
  ) => Promise<ContentCollection>;
  listContentCollections: () => Promise<ContentCollection[]>;
};

export type GitHubControllerHandlers = {
  addIssueLabels: (
    issueNumber: number,
    labels: GitHubIssueLabel[]
  ) => Promise<GitHubIssue>;
  createIssue: (input: GitHubIssueInput) => Promise<GitHubIssue>;
  getIssue: (issueNumber: number) => Promise<GitHubIssue>;
  listIssues: () => Promise<GitHubIssue[]>;
  updateIssue: (
    issueNumber: number,
    input: GitHubIssueUpdateInput
  ) => Promise<GitHubIssue>;
};

export type PagesControllerHandlers = {
  createPage: (payload: CmsPageInput) => Promise<CmsPage>;
  getPage: (id: string) => Promise<CmsPage>;
  getPagePreviewById: (id: string) => Promise<PagePreview>;
  listPages: () => Promise<CmsPage[]>;
  syncPageToGitHub: (id: string) => Promise<SyncPageToGitHubResult>;
};

export type PreviewControllerHandlers = {
  getPagePreviewBySlug: (slug: string) => Promise<PagePreview>;
};

export type MeControllerHandler = {
  getCurrentUser: (sessionId: string | undefined) => AuthUser;
};
