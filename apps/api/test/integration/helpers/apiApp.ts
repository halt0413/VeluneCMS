import { createApp } from "../../../src/createApp";
import { InMemoryContentCollectionRepository } from "../../../src/infrastructure/contentCollectionRepository";
import { InMemoryPageRepository } from "../../../src/infrastructure/pageRepository";
import { InMemorySessionRepository } from "../../../src/infrastructure/authRepository";
import {
  createContentCollection,
  deleteContentCollection,
  getContentCollection,
  listContentCollections,
  updateContentCollection
} from "../../../src/usecase/contentCollection";
import {
  createPage,
  deletePage,
  getPage,
  getPagePreview,
  getPagePreviewById,
  listPages,
  updatePage
} from "../../../src/usecase/page";
import {
  getCurrentUser,
  logout,
  type AuthSession,
  type CompleteGitHubLoginResult
} from "../../../src/usecase/auth";
import type { AuthUser } from "../../../src/domain";
import {
  apiTestAvatarUrl,
  apiTestCmsOrigin,
  apiTestContentListUrl,
  apiTestGitHubAuthorizeUrl,
  apiTestProfileUrl
} from "../../helpers/testEnv";

export const integrationAdminApiToken = "integration-admin-token";
export const integrationCmsOrigin = apiTestCmsOrigin;
export const integrationContentListUrl = apiTestContentListUrl();
export const integrationFixedNow = "2026-01-01T00:00:00.000Z";
export const integrationGitHubAuthorizeUrl = apiTestGitHubAuthorizeUrl;
export const integrationSessionCookieName = "velune_session";
export const integrationSessionIdFromCallback = "session-from-callback";

type CreateIntegrationApiOptions = {
  completeGitHubLogin?: (input: {
    code?: string;
    state?: string;
  }) => Promise<CompleteGitHubLoginResult>;
  startGitHubLogin?: (redirectTo: string | undefined) => {
    authorizationUrl: string;
  };
};

export function createIntegrationApi(options: CreateIntegrationApiOptions = {}) {
  const contentCollectionRepository =
    new InMemoryContentCollectionRepository();
  const pageRepository = new InMemoryPageRepository();
  const sessionRepository = new InMemorySessionRepository();
  let idSequence = 1;

  const createId = () => `generated-${idSequence++}`;
  const getNow = () => integrationFixedNow;

  const app = createApp({
    adminApiToken: integrationAdminApiToken,
    completeGitHubLogin:
      options.completeGitHubLogin ??
      (async () => ({
        redirectUrl: integrationContentListUrl,
        sessionId: integrationSessionIdFromCallback,
        user: createIntegrationUser()
      })),
    cookieSecure: false,
    createContent: (input, actor) =>
      createPage(
        input,
        {
          createId,
          getNow,
          pageRepository
        },
        actor
      ),
    createContentCollection: (input) =>
      createContentCollection(input, {
        contentCollectionRepository,
        createId,
        getNow
      }),
    deleteContent: (id, actor) => deletePage(pageRepository, id, actor),
    deleteContentCollection: (id) =>
      deleteContentCollection(id, contentCollectionRepository),
    getContent: (id) => getPage(pageRepository, id),
    getContentCollection: (id) =>
      getContentCollection(id, contentCollectionRepository),
    getContentPreviewById: (id) => getPagePreviewById(pageRepository, id),
    getCurrentUser: (sessionId) => getCurrentUser(sessionId, sessionRepository),
    getPagePreviewBySlug: (slug) => getPagePreview(pageRepository, slug),
    listContentCollections: () =>
      listContentCollections(contentCollectionRepository),
    listContents: () => listPages(pageRepository),
    logout: (sessionId) => logout(sessionId, sessionRepository),
    sessionCookieName: integrationSessionCookieName,
    sessionRepository,
    startGitHubLogin:
      options.startGitHubLogin ??
      (() => ({
        authorizationUrl: integrationGitHubAuthorizeUrl
      })),
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
    updateContentCollection: (id, input) =>
      updateContentCollection(id, input, {
        contentCollectionRepository,
        getNow
      }),
    webOrigin: integrationCmsOrigin
  });

  return {
    app,
    createSession(user = createIntegrationUser()): AuthSession {
      const session: AuthSession = {
        createdAt: getNow(),
        id: `session-${user.id}`,
        user
      };

      sessionRepository.create(session);
      return session;
    }
  };
}

export function createIntegrationUser(
  overrides: Partial<AuthUser> = {}
): AuthUser {
  return {
    avatarUrl: apiTestAvatarUrl(),
    email: null,
    id: 1,
    login: "example-user",
    name: null,
    profileUrl: apiTestProfileUrl("example-user"),
    ...overrides
  };
}

export function createAuthHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${integrationAdminApiToken}`
  };
}

export function createSessionCookie(sessionId: string): string {
  return `${integrationSessionCookieName}=${sessionId}`;
}

export function createContentPayload(overrides = {}) {
  return {
    body: "本文",
    contentType: "portfolio",
    slug: "example-page",
    status: "draft",
    title: "Example Page",
    ...overrides
  };
}

export function createCollectionPayload(overrides = {}) {
  return {
    name: "Example Collection",
    slug: "example-collection",
    ...overrides
  };
}
