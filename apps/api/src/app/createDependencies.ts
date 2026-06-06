import { createApp } from "../createApp";
import type { ApiEnv } from "../config/env";
import type { CreateAppDependencies } from "./types";
import {
  InMemoryOAuthStateRepository,
  InMemorySessionRepository
} from "../infrastructure/authRepository";
import { GitHubOAuthApi } from "../infrastructure/github/oauthGateway";
import { InMemoryPageRepository } from "../infrastructure/pageRepository";
import {
  InMemoryContentCollectionRepository
} from "../infrastructure/contentCollectionRepository";
import type { ContentCollectionRepository, PageRepository } from "../domain";
import {
  completeGitHubLogin,
  getCurrentUser,
  logout,
  startGitHubLogin
} from "../usecase/auth";
import {
  createPage,
  deletePage,
  getPage,
  getPagePreview,
  getPagePreviewById,
  listPages,
  updatePage
} from "../usecase/page";
import {
  createContentCollection,
  deleteContentCollection,
  getContentCollection,
  listContentCollections,
  updateContentCollection
} from "../usecase/contentCollection";

type RuntimeDependencies = {
  createId: () => string;
  getNow: () => string;
  oAuthStateRepository?: InMemoryOAuthStateRepository;
  pageRepository?: PageRepository;
  sessionRepository?: InMemorySessionRepository;
  contentCollectionRepository?: ContentCollectionRepository;
};

export function createApiDependencies(
  env: ApiEnv,
  {
    contentCollectionRepository = new InMemoryContentCollectionRepository(),
    createId,
    getNow,
    oAuthStateRepository = new InMemoryOAuthStateRepository(),
    pageRepository = new InMemoryPageRepository(),
    sessionRepository = new InMemorySessionRepository()
  }: RuntimeDependencies
): CreateAppDependencies {
  // Infrastructureの実装をここで束ねて、Presentation層へはusecaseだけを渡す
  const gitHubOAuthGateway = new GitHubOAuthApi(env.githubOAuth);

  return {
    adminApiToken: env.adminApiToken,
    completeGitHubLogin: (input: { code?: string; state?: string }) =>
      completeGitHubLogin(input, {
        createId,
        getNow,
        gitHubOAuthGateway,
        oAuthStateRepository,
        oAuthStateTtlSeconds: env.githubOAuth.stateTtlSeconds,
        sessionRepository
      }),
    cookieSecure: env.session.cookieSecure,
    createContent: (input, actor) =>
      createPage(
        input,
        {
          pageRepository,
          createId,
          getNow
        },
        actor
      ),
    createContentCollection: (input) =>
      createContentCollection(input, {
        contentCollectionRepository,
        createId,
        getNow
      }),
    deleteContentCollection: (id) =>
      deleteContentCollection(id, contentCollectionRepository),
    getContentCollection: (id) =>
      getContentCollection(id, contentCollectionRepository),
    deleteContent: (id: string, actor) => deletePage(pageRepository, id, actor),
    getCurrentUser: (sessionId: string | undefined) =>
      getCurrentUser(sessionId, sessionRepository),
    getContent: (id: string) => getPage(pageRepository, id),
    getContentPreviewById: (id: string) => getPagePreviewById(pageRepository, id),
    getPagePreviewBySlug: (slug: string) => getPagePreview(pageRepository, slug),
    listContents: () => listPages(pageRepository),
    listContentCollections: () =>
      listContentCollections(contentCollectionRepository),
    logout: (sessionId: string | undefined) => logout(sessionId, sessionRepository),
    sessionCookieName: env.session.cookieName,
    sessionRepository,
    startGitHubLogin: (redirectTo: string | undefined) =>
      startGitHubLogin(redirectTo, {
        cmsUrl: env.cmsUrl,
        createId,
        getNow,
        gitHubOAuthGateway,
        oAuthStateRepository
      }),
    updateContentCollection: (id, input) =>
      updateContentCollection(id, input, {
        contentCollectionRepository,
        getNow
      }),
    updateContent: (id, input, actor) =>
      updatePage(
        id,
        input,
        {
          getNow,
          pageRepository
        },
        actor
      ),
    webOrigin: new URL(env.cmsUrl).origin
  };
}

export function createApiApp(env: ApiEnv, runtime: RuntimeDependencies) {
  return createApp(createApiDependencies(env, runtime));
}
