import type {
  AuthSession,
  OAuthState,
  OAuthStateRepository,
  SessionRepository
} from "../usecase/auth";

export class InMemoryOAuthStateRepository implements OAuthStateRepository {
  private readonly states = new Map<string, OAuthState>();

  create(state: OAuthState): void {
    this.states.set(state.id, state);
  }

  consume(id: string): OAuthState | null {
    const state = this.states.get(id);

    if (!state) {
      return null;
    }

    this.states.delete(id);
    return state;
  }
}

export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, AuthSession>();

  create(session: AuthSession): void {
    this.sessions.set(session.id, session);
  }

  get(id: string): AuthSession | null {
    const session = this.sessions.get(id);

    if (!session) {
      return null;
    }

    return session;
  }

  delete(id: string): void {
    this.sessions.delete(id);
  }
}
