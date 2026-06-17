import { describe, expect, it } from "vitest";
import { resolveAuthRedirectUrl } from "../../../src/domain";
import {
  apiTestCmsAppBaseUrl,
  apiTestCmsOrigin,
  apiTestContentListUrl,
  apiTestContentQueryUrl
} from "../../helpers/testEnv";

const cmsUrl = apiTestCmsOrigin;
const cmsAppUrl = apiTestCmsAppBaseUrl;
const contentsPath = "/contents";
const contentsUrl = apiTestContentListUrl();
const contentsQueryPath = "contents?type=portfolio";
const contentsQueryUrl = apiTestContentQueryUrl();

describe("resolveAuthRedirectUrl", () => {
  it("redirectToがない場合はCMS URLを返す", () => {
    const redirectTo: string | undefined = undefined;

    expect(resolveAuthRedirectUrl(cmsUrl, redirectTo)).toBe(cmsUrl);
  });

  it("相対パスをCMS URLから解決する", () => {
    expect(resolveAuthRedirectUrl(cmsUrl, contentsPath)).toBe(contentsUrl);
  });

  it("相対パスにqueryが含まれていても維持する", () => {
    expect(resolveAuthRedirectUrl(cmsAppUrl, contentsQueryPath)).toBe(
      contentsQueryUrl
    );
  });
});
