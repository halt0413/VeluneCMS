import { describe, expect, it } from "vitest";
import { resolveAuthRedirectUrl } from "../../../src/domain";

const cmsUrl = "http://localhost:3000";
const cmsAppUrl = "http://localhost:3000/app/";
const contentsPath = "/contents";
const contentsUrl = "http://localhost:3000/contents";
const contentsQueryPath = "contents?type=portfolio";
const contentsQueryUrl = "http://localhost:3000/app/contents?type=portfolio";

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
