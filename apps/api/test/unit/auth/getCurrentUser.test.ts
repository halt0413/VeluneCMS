import { describe, expect, it } from "vitest";
import { getCurrentUser } from "../../../src/usecase/auth";
import {
  createAuthUser,
  TestSessionRepository
} from "../helpers/authUsecase";

describe("getCurrentUser", () => {
  it("sessionのユーザーを返す", () => {
    const sessionRepository = new TestSessionRepository();
    const user = createAuthUser();
    sessionRepository.create({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "session-1",
      user
    });

    expect(getCurrentUser("session-1", sessionRepository)).toEqual(user);
  });

  it("session idがない場合はエラーにする", () => {
    expect(() => getCurrentUser(undefined, new TestSessionRepository())).toThrow(
      "Unauthorized"
    );
  });

  it("sessionが存在しない場合はエラーにする", () => {
    expect(() =>
      getCurrentUser("missing-session", new TestSessionRepository())
    ).toThrow("Unauthorized");
  });
});
