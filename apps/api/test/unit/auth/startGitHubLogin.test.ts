import { describe, expect, it } from "vitest";
import { startGitHubLogin } from "../../../src/usecase/auth";
import {
  TestGitHubOAuthGateway,
  TestOAuthStateRepository
} from "../helpers/authUsecase";
import {
  apiTestCmsOrigin,
  apiTestContentListUrl,
  apiTestGitHubAuthorizeUrlWithState
} from "../../helpers/testEnv";

describe("startGitHubLogin", () => {
  it("OAuth stateを保存して認可URLを返す", () => {
    const gitHubOAuthGateway = new TestGitHubOAuthGateway();
    const oAuthStateRepository = new TestOAuthStateRepository();

    const result = startGitHubLogin("/contents", {
      cmsUrl: apiTestCmsOrigin,
      createId: () => "state-1",
      getNow: () => "2026-01-01T00:00:00.000Z",
      gitHubOAuthGateway,
      oAuthStateRepository
    });

    expect(result).toEqual({
      authorizationUrl: apiTestGitHubAuthorizeUrlWithState("state-1")
    });
    expect(oAuthStateRepository.states.get("state-1")).toEqual({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "state-1",
      redirectUrl: apiTestContentListUrl()
    });
    expect(gitHubOAuthGateway.authorizationInputs).toEqual([
      {
        state: "state-1"
      }
    ]);
  });
});
