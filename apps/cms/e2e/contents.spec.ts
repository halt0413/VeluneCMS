import { expect, test } from "@playwright/test";
import { mockCmsApi } from "./helpers/mockCmsApi";

test("コンテンツを追加、更新、削除できる", async ({ page }) => {
  await mockCmsApi(page);

  await page.goto("/contents");
  await page.getByRole("link", { name: "追加", exact: true }).click();
  await expect(page.getByRole("heading", { name: "portfolio のコンテンツ追加" })).toBeVisible();

  await page.getByLabel("タイトル").fill("E2E Content");
  await page.getByLabel("slug").fill("e2e-content");
  await page.getByLabel("本文").fill("E2E本文");
  await page.getByRole("button", { name: "追加" }).click();

  await expect(page).toHaveURL(/\/contents\/content-1$/u);
  await expect(page.getByRole("heading", { name: "E2E Content" })).toBeVisible();
  await expect(page.getByText("E2E本文")).toBeVisible();

  await page.getByRole("link", { name: "編集する" }).click();
  await expect(page.getByRole("heading", { name: "コンテンツ編集" })).toBeVisible();
  await page.getByLabel("タイトル").fill("E2E Content Updated");
  await page.getByRole("button", { name: "更新する" }).click();

  await expect(page).toHaveURL(/\/contents\/content-1$/u);
  await expect(page.getByRole("heading", { name: "E2E Content Updated" })).toBeVisible();

  await page.getByRole("link", { name: "編集する" }).click();
  await page.getByRole("button", { name: "削除" }).click();
  await expect(page.getByRole("heading", { name: "コンテンツを削除" })).toBeVisible();
  await page.getByRole("button", { name: "削除" }).last().click();

  await expect(page).toHaveURL(/\/contents\?collection=portfolio/u);
  await expect(page.getByText("E2E Content Updated")).toHaveCount(0);
});
