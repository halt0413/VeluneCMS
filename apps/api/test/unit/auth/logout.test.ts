import { describe, expect, it } from "vitest";
import { logout } from "../../../src/usecase/auth";
import { TestSessionRepository } from "../helpers/authUsecase";

describe("logout", () => {
  it("session idがある場合は削除して成功を返す", () => {
    const sessionRepository = new TestSessionRepository();

    expect(logout("session-1", sessionRepository)).toEqual({
      loggedOut: true
    });
    expect(sessionRepository.deletedSessionIds).toEqual(["session-1"]);
  });

  it("session idがない場合も成功を返す", () => {
    const sessionRepository = new TestSessionRepository();

    expect(logout(undefined, sessionRepository)).toEqual({
      loggedOut: true
    });
    expect(sessionRepository.deletedSessionIds).toEqual([]);
  });
});
