import type { Page, Route } from "@playwright/test";
import {
  cmsE2eApiBaseUrl,
  cmsE2eAvatarUrl,
  cmsE2eProfileUrl
} from "./e2eEnv";

type MockPageContent = {
  body: string;
  contentType: string;
  createdAt: string;
  id: string;
  slug: string;
  status: "draft" | "published";
  title: string;
  updatedAt: string;
  publishedAt?: string;
};

type MockContentCollection = {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

const fixedNow = "2026-01-01T00:00:00.000Z";
const currentUser = {
  avatarUrl: cmsE2eAvatarUrl(),
  email: null,
  id: 1,
  login: "example-user",
  name: null,
  profileUrl: cmsE2eProfileUrl("example-user")
};

export async function mockCmsApi(page: Page) {
  const collections = new Map<string, MockContentCollection>([
    [
      "collection-portfolio",
      {
        createdAt: fixedNow,
        id: "collection-portfolio",
        name: "portfolio",
        slug: "portfolio",
        updatedAt: fixedNow
      }
    ]
  ]);
  const contents = new Map<string, MockPageContent>([
    [
      "content-welcome",
      {
        body: "既存本文",
        contentType: "portfolio",
        createdAt: fixedNow,
        id: "content-welcome",
        slug: "welcome",
        status: "draft",
        title: "Welcome Content",
        updatedAt: fixedNow
      }
    ]
  ]);
  let contentIdSequence = 1;
  let collectionIdSequence = 1;

  await page.route(`${cmsE2eApiBaseUrl}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();

    if (url.pathname === "/me") {
      await json(route, { user: currentUser });
      return;
    }

    if (url.pathname === "/content-collections") {
      if (method === "GET") {
        const items = Array.from(collections.values());
        await json(route, { items, total: items.length });
        return;
      }

      if (method === "POST") {
        const payload = await request.postDataJSON();
        const created: MockContentCollection = {
          createdAt: fixedNow,
          id: `collection-${collectionIdSequence++}`,
          name: String(payload.name),
          slug: String(payload.slug),
          updatedAt: fixedNow
        };

        collections.set(created.id, created);
        await json(route, { created }, 201);
        return;
      }
    }

    if (url.pathname.startsWith("/content-collections/")) {
      const id = url.pathname.replace("/content-collections/", "");
      const collection = collections.get(id);

      if (!collection) {
        await json(route, { error: "Not found" }, 404);
        return;
      }

      if (method === "GET") {
        await json(route, { item: collection });
        return;
      }

      if (method === "PATCH") {
        const payload = await request.postDataJSON();
        const updated = {
          ...collection,
          ...payload,
          updatedAt: fixedNow
        };

        collections.set(id, updated);
        await json(route, { updated });
        return;
      }

      if (method === "DELETE") {
        collections.delete(id);
        await json(route, { deleted: true, id });
        return;
      }
    }

    if (url.pathname === "/contents") {
      if (method === "GET") {
        const items = Array.from(contents.values());
        await json(route, { items, total: items.length });
        return;
      }

      if (method === "POST") {
        const payload = await request.postDataJSON();
        const created: MockPageContent = {
          body: String(payload.body),
          contentType: String(payload.contentType),
          createdAt: fixedNow,
          id: `content-${contentIdSequence++}`,
          publishedAt:
            payload.status === "published" ? fixedNow : undefined,
          slug: String(payload.slug),
          status: payload.status,
          title: String(payload.title),
          updatedAt: fixedNow
        };

        contents.set(created.id, created);
        await json(route, { created }, 201);
        return;
      }
    }

    if (url.pathname.startsWith("/contents/")) {
      const id = url.pathname.replace("/contents/", "").replace("/preview", "");
      const content = contents.get(id);

      if (!content) {
        await json(route, { error: "Not found" }, 404);
        return;
      }

      if (url.pathname.endsWith("/preview")) {
        await json(route, {
          content: {
            body: content.body,
            slug: content.slug,
            title: content.title
          },
          slug: content.slug,
          status: "preview"
        });
        return;
      }

      if (method === "GET") {
        await json(route, { item: content });
        return;
      }

      if (method === "PATCH") {
        const payload = await request.postDataJSON();
        const status = payload.status ?? content.status;
        const updated: MockPageContent = {
          ...content,
          ...payload,
          publishedAt: status === "published" ? fixedNow : undefined,
          status,
          updatedAt: fixedNow
        };

        contents.set(id, updated);
        await json(route, { updated });
        return;
      }

      if (method === "DELETE") {
        contents.delete(id);
        await json(route, { deleted: true, id });
        return;
      }
    }

    await route.fallback();
  });
}

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    body: JSON.stringify(body),
    contentType: "application/json",
    status
  });
}
