import { getCookie } from "hono/cookie";
import type { MiddlewareHandler } from "hono";
import { UnauthorizedError } from "../lib/errors/AppError";
import type { SessionRepository } from "../usecase/auth";

type CreateAuthMiddlewareConfig = {
  adminApiToken: string;
  sessionCookieName: string;
  sessionRepository: SessionRepository;
};

export function createAuthMiddleware({
  adminApiToken,
  sessionCookieName,
  sessionRepository
}: CreateAuthMiddlewareConfig): MiddlewareHandler {
  return async (c, next) => {
    const authorization = c.req.header("authorization");
    const sessionId = getCookie(c, sessionCookieName);

    // CLIや内部連携はBearer、管理画面はsession cookieで通すため両方を許可する
    if (authorization === `Bearer ${adminApiToken}`) {
      await next();
      return;
    }

    if (sessionId && sessionRepository.get(sessionId)) {
      await next();
      return;
    }

    throw new UnauthorizedError();
  };
}
