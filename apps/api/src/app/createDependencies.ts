import { createApp } from "../createApp";
import type { ApiEnv } from "../config/env";
import type { CreateAppDependencies } from "./types";
import {
  InMemoryOAuthStateRepository,
  InMemorySessionRepository
} from "../infrastructure/authRepository";
import { OctokitGitHubIssueGateway } from "../infrastructure/github/issueGateway";
import { GitHubOAuthApi } from "../infrastructure/github/oauthGateway";
import { InMemoryPageRepository } from "../infrastructure/pageRepository";
import type { PageRepository } from "../usecase/page";
import {
  completeGitHubLogin,
  getCurrentUser,
  logout,
  startGitHubLogin
} from "../usecase/auth";
import {
  createIssue,
  getIssue,
  listIssues,
  updateIssue,
  updateIssueLabels
} from "../usecase/github";
import {
  createPage,
  deletePage,
  getPage,
  getPagePreview,
  getPagePreviewById,
  listPages,
  updatePage
} from "../usecase/page";

type RuntimeDependencies = {
  createId: () => string;
  getNow: () => string;
  pageRepository?: PageRepository;
};

export function createApiDependencies(
  env: ApiEnv,
  { createId, getNow, pageRepository = new InMemoryPageRepository() }: RuntimeDependencies
): CreateAppDependencies {
  // Infrastructureの実装をここで束ねて、Presentation層へはusecaseだけを渡す
  const sessionRepository = new InMemorySessionRepository();
  const oAuthStateRepository = new InMemoryOAuthStateRepository();
  const gitHubIssueGateway = new OctokitGitHubIssueGateway(env.github);
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
    createContent: (input) =>
      createPage(input, {
        pageRepository,
        createId,
        getNow
      }),
    createIssue: (input) => createIssue(gitHubIssueGateway, input),
    deleteContent: (id: string) => deletePage(pageRepository, id),
    getCurrentUser: (sessionId: string | undefined) =>
      getCurrentUser(sessionId, sessionRepository),
    getContent: (id: string) => getPage(pageRepository, id),
    getContentPreviewById: (id: string) => getPagePreviewById(pageRepository, id),
    getIssue: (issueNumber: number) => getIssue(gitHubIssueGateway, issueNumber),
    getPagePreviewBySlug: (slug: string) => getPagePreview(pageRepository, slug),
    githubWebhookSecret: env.githubWebhookSecret,
    listContents: () => listPages(pageRepository),
    listIssues: () => listIssues(gitHubIssueGateway),
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
    addIssueLabels: (issueNumber, labels) =>
      updateIssueLabels(gitHubIssueGateway, issueNumber, labels),
    updateContent: (id, input) =>
      updatePage(id, input, {
        getNow,
        pageRepository
      }),
    updateIssue: (issueNumber, input) =>
      updateIssue(gitHubIssueGateway, issueNumber, input),
    webOrigin: new URL(env.cmsUrl).origin
  };
}

export function createApiApp(env: ApiEnv, runtime: RuntimeDependencies) {
  return createApp(createApiDependencies(env, runtime));
}
