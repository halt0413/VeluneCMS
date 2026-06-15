import { describe, expect, it } from "vitest";
import { startGitHubLogin } from "../../../src/usecase/auth";
import {
  TestGitHubOAuthGateway,
  TestOAuthStateRepository
} from "../helpers/authUsecase";

describe("startGitHubLogin", () => {
  it("OAuth stateを保存して認可URLを返す", () => {
    const gitHubOAuthGateway = new TestGitHubOAuthGateway();
    const oAuthStateRepository = new TestOAuthStateRepository();

    const result = startGitHubLogin("/contents", {
      cmsUrl: "http://localhost:3000",
      createId: () => "state-1",
      getNow: () => "2026-01-01T00:00:00.000Z",
      gitHubOAuthGateway,
      oAuthStateRepository
    });

    expect(result).toEqual({
      authorizationUrl:
        "https://github.com/login/oauth/authorize?state=state-1"
    });
    expect(oAuthStateRepository.states.get("state-1")).toEqual({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "state-1",
      redirectUrl: "http://localhost:3000/contents"
    });
    expect(gitHubOAuthGateway.authorizationInputs).toEqual([
      {
        state: "state-1"
      }
    ]);
  });
});
