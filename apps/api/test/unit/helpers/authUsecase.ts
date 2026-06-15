import type {
  AuthSession,
  GitHubOAuthAuthorizeInput,
  GitHubOAuthGateway,
  OAuthState,
  OAuthStateRepository,
  SessionRepository
} from "../../../src/usecase/auth";
import type { AuthUser } from "../../../src/domain";

export function createAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    avatarUrl: "https://example.com/avatar.png",
    email: null,
    id: 1,
    login: "example-user",
    name: null,
    profileUrl: "https://example.com/example-user",
    ...overrides
  };
}

export class TestOAuthStateRepository implements OAuthStateRepository {
  readonly states = new Map<string, OAuthState>();

  create(state: OAuthState): void {
    this.states.set(state.id, state);
  }

  consume(id: string): OAuthState | null {
    const state = this.states.get(id) ?? null;
    this.states.delete(id);
    return state;
  }
}

export class TestSessionRepository implements SessionRepository {
  readonly sessions = new Map<string, AuthSession>();
  readonly deletedSessionIds: string[] = [];

  create(session: AuthSession): void {
    this.sessions.set(session.id, session);
  }

  get(id: string): AuthSession | null {
    return this.sessions.get(id) ?? null;
  }

  delete(id: string): void {
    this.deletedSessionIds.push(id);
    this.sessions.delete(id);
  }
}

export class TestGitHubOAuthGateway implements GitHubOAuthGateway {
  readonly authorizationInputs: GitHubOAuthAuthorizeInput[] = [];
  accessToken = "github-access-token";
  user = createAuthUser();

  createAuthorizationUrl(input: GitHubOAuthAuthorizeInput): string {
    this.authorizationInputs.push(input);
    return `https://github.com/login/oauth/authorize?state=${input.state}`;
  }

  async exchangeCodeForAccessToken(): Promise<string> {
    return this.accessToken;
  }

  async getUser(): Promise<AuthUser> {
    return this.user;
  }
}

export function createAuthDependencies(
  overrides: {
    gitHubOAuthGateway?: GitHubOAuthGateway;
    oAuthStateRepository?: OAuthStateRepository;
    sessionRepository?: SessionRepository;
  } = {}
) {
  return {
    createId: () => "session-1",
    getNow: () => "2026-01-01T00:00:00.000Z",
    gitHubOAuthGateway:
      overrides.gitHubOAuthGateway ?? new TestGitHubOAuthGateway(),
    oAuthStateRepository:
      overrides.oAuthStateRepository ?? new TestOAuthStateRepository(),
    oAuthStateTtlSeconds: 300,
    sessionRepository: overrides.sessionRepository ?? new TestSessionRepository()
  };
}
