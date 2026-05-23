import type { LogoutResponse } from "../presentation/contracts";
import type { AuthUser } from "../domain";
import {
  isOAuthStateExpired,
  resolveAuthRedirectUrl
} from "../domain";
import { BadRequestError, UnauthorizedError } from "../lib/errors/AppError";

export type GitHubOAuthAuthorizeInput = {
  state: string;
};

export interface GitHubOAuthGateway {
  createAuthorizationUrl(input: GitHubOAuthAuthorizeInput): string;
  exchangeCodeForAccessToken(code: string): Promise<string>;
  getUser(accessToken: string): Promise<AuthUser>;
}

export type OAuthState = {
  id: string;
  redirectUrl: string;
  createdAt: string;
};

export interface OAuthStateRepository {
  create(state: OAuthState): void;
  consume(id: string): OAuthState | null;
}

export type AuthSession = {
  id: string;
  user: AuthUser;
  createdAt: string;
};

export interface SessionRepository {
  create(session: AuthSession): void;
  get(id: string): AuthSession | null;
  delete(id: string): void;
}

export type CompleteGitHubLoginResult = {
  redirectUrl: string;
  sessionId: string;
  user: Awaited<ReturnType<GitHubOAuthGateway["getUser"]>>;
};

type CompleteGitHubLoginDependencies = {
  createId: () => string;
  getNow: () => string;
  gitHubOAuthGateway: GitHubOAuthGateway;
  oAuthStateRepository: OAuthStateRepository;
  oAuthStateTtlSeconds: number;
  sessionRepository: SessionRepository;
};

type StartGitHubLoginDependencies = {
  cmsUrl: string;
  createId: () => string;
  getNow: () => string;
  gitHubOAuthGateway: GitHubOAuthGateway;
  oAuthStateRepository: OAuthStateRepository;
};

type StartGitHubLoginResult = {
  authorizationUrl: string;
};

export async function completeGitHubLogin(
  input: {
    code?: string;
    state?: string;
  },
  {
    createId,
    getNow,
    gitHubOAuthGateway,
    oAuthStateRepository,
    oAuthStateTtlSeconds,
    sessionRepository
  }: CompleteGitHubLoginDependencies
): Promise<CompleteGitHubLoginResult> {
  if (!input.code || !input.state) {
    throw new BadRequestError("GitHub callback requires code and state");
  }

  const authState = oAuthStateRepository.consume(input.state);

  if (!authState) {
    throw new UnauthorizedError("Invalid OAuth state");
  }

  const now = getNow();

  if (isOAuthStateExpired(authState.createdAt, now, oAuthStateTtlSeconds)) {
    throw new UnauthorizedError("Expired OAuth state");
  }

  const accessToken = await gitHubOAuthGateway.exchangeCodeForAccessToken(
    input.code
  );
  const user = await gitHubOAuthGateway.getUser(accessToken);
  const sessionId = createId();

  sessionRepository.create({
    id: sessionId,
    user,
    createdAt: now
  });

  return {
    redirectUrl: authState.redirectUrl,
    sessionId,
    user
  };
}

export function getCurrentUser(
  sessionId: string | undefined,
  sessionRepository: SessionRepository
): AuthUser {
  if (!sessionId) {
    throw new UnauthorizedError();
  }

  const session = sessionRepository.get(sessionId);

  if (!session) {
    throw new UnauthorizedError();
  }

  return session.user;
}

export function logout(
  sessionId: string | undefined,
  sessionRepository: SessionRepository
): LogoutResponse {
  if (sessionId) {
    sessionRepository.delete(sessionId);
  }

  return {
    loggedOut: true
  };
}

export function startGitHubLogin(
  redirectTo: string | undefined,
  {
    cmsUrl,
    createId,
    getNow,
    gitHubOAuthGateway,
    oAuthStateRepository
  }: StartGitHubLoginDependencies
): StartGitHubLoginResult {
  const state = createId();
  const redirectUrl = resolveAuthRedirectUrl(cmsUrl, redirectTo);

  oAuthStateRepository.create({
    id: state,
    redirectUrl,
    createdAt: getNow()
  });

  return {
    authorizationUrl: gitHubOAuthGateway.createAuthorizationUrl({ state })
  };
}
