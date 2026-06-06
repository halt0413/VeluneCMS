import type { LogoutResponse } from "./contracts";
import type {
  ContentCollectionInput,
  ContentCollectionPatch,
  ContentCollectionSnapshot
} from "../domain";
import type { CompleteGitHubLoginResult } from "../usecase/auth";
import type { PagePreview } from "../usecase/page";
import type {
  AuthUser,
  CmsPage,
  CmsPageInput,
  CmsPagePatch
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
  createContent: (payload: CmsPageInput, actor?: AuthUser) => Promise<CmsPage>;
  deleteContent: (id: string, actor?: AuthUser) => Promise<{
    deleted: true;
    id: string;
  }>;
  getCurrentUser: (sessionId: string | undefined) => AuthUser;
  getContent: (id: string) => Promise<CmsPage>;
  getContentPreviewById: (id: string) => Promise<PagePreview>;
  listContents: () => Promise<CmsPage[]>;
  updateContent: (
    id: string,
    payload: CmsPagePatch,
    actor?: AuthUser
  ) => Promise<CmsPage>;
};

export type ContentCollectionsControllerHandlers = {
  createContentCollection: (
    payload: ContentCollectionInput
  ) => Promise<ContentCollectionSnapshot>;
  deleteContentCollection: (id: string) => Promise<{
    deleted: true;
    id: string;
  }>;
  getContentCollection: (id: string) => Promise<ContentCollectionSnapshot>;
  listContentCollections: () => Promise<ContentCollectionSnapshot[]>;
  updateContentCollection: (
    id: string,
    payload: ContentCollectionPatch
  ) => Promise<ContentCollectionSnapshot>;
};

export type PagesControllerHandlers = {
  createPage: (payload: CmsPageInput) => Promise<CmsPage>;
  getPage: (id: string) => Promise<CmsPage>;
  getPagePreviewById: (id: string) => Promise<PagePreview>;
  listPages: () => Promise<CmsPage[]>;
};

export type PreviewControllerHandlers = {
  getPagePreviewBySlug: (slug: string) => Promise<PagePreview>;
};

export type MeControllerHandler = {
  getCurrentUser: (sessionId: string | undefined) => AuthUser;
};
