import { expect, test } from "@playwright/test";
import { mockCmsApi } from "./helpers/mockCmsApi";

test("コンテンツ種別を追加、編集、削除できる", async ({ page }) => {
  await mockCmsApi(page);

  await page.goto("/content-collections/new");
  await page.getByLabel("名前").fill("Blog");
  await page.getByLabel("slug").fill("blog");
  await page.getByRole("button", { name: "追加" }).click();

  await expect(page).toHaveURL(/\/contents$/u);
  await expect(page.getByText("コンテンツ一覧")).toBeVisible();

  await page.goto("/content-collections/collection-1/edit");
  await expect(page.getByRole("heading", { name: "コンテンツ種別を編集" })).toBeVisible();
  await page.getByLabel("名前").fill("Blog Updated");
  await page.getByRole("button", { name: "更新する" }).click();

  await expect(page).toHaveURL(/\/contents\?collection=blog/u);

  await page.goto("/content-collections/collection-1/edit");
  await expect(page.locator('input[name="name"]')).toHaveValue("Blog Updated");
  await page.getByRole("button", { name: "削除" }).click();
  await expect(page.getByRole("heading", { name: "コンテンツ種別を削除" })).toBeVisible();
  await page.getByRole("button", { name: "削除" }).last().click();

  await expect(page).toHaveURL(/\/contents$/u);
});
