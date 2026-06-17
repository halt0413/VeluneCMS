import { describe, expect, it } from "vitest";
import { completeGitHubLogin } from "../../../src/usecase/auth";
import {
  createAuthDependencies,
  TestOAuthStateRepository,
  TestSessionRepository
} from "../helpers/authUsecase";
import { apiTestContentListUrl } from "../../helpers/testEnv";

describe("completeGitHubLogin", () => {
  it("GitHub userを取得してsessionを作成する", async () => {
    const oAuthStateRepository = new TestOAuthStateRepository();
    const sessionRepository = new TestSessionRepository();
    oAuthStateRepository.create({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "state-1",
      redirectUrl: apiTestContentListUrl()
    });

    const result = await completeGitHubLogin(
      {
        code: "github-code",
        state: "state-1"
      },
      createAuthDependencies({
        oAuthStateRepository,
        sessionRepository
      })
    );

    expect(result).toMatchObject({
      redirectUrl: apiTestContentListUrl(),
      sessionId: "session-1",
      user: {
        id: 1,
        login: "example-user"
      }
    });
    expect(sessionRepository.sessions.get("session-1")).toMatchObject({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "session-1",
      user: {
        id: 1,
        login: "example-user"
      }
    });
  });

  it("codeがない場合はエラーにする", async () => {
    await expect(
      completeGitHubLogin(
        {
          state: "state-1"
        },
        createAuthDependencies()
      )
    ).rejects.toMatchObject({
      message: "GitHub callback requires code and state",
      statusCode: 400
    });
  });

  it("stateが存在しない場合はエラーにする", async () => {
    await expect(
      completeGitHubLogin(
        {
          code: "github-code",
          state: "missing-state"
        },
        createAuthDependencies()
      )
    ).rejects.toMatchObject({
      message: "Invalid OAuth state",
      statusCode: 401
    });
  });

  it("stateが期限切れの場合はエラーにする", async () => {
    const oAuthStateRepository = new TestOAuthStateRepository();
    oAuthStateRepository.create({
      createdAt: "2025-12-31T23:00:00.000Z",
      id: "state-1",
      redirectUrl: apiTestContentListUrl()
    });

    await expect(
      completeGitHubLogin(
        {
          code: "github-code",
          state: "state-1"
        },
        createAuthDependencies({
          oAuthStateRepository
        })
      )
    ).rejects.toMatchObject({
      message: "Expired OAuth state",
      statusCode: 401
    });
  });
});
