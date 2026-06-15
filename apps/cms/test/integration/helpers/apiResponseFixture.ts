export const cmsApiBaseUrl = "http://localhost:8787/api";

export function createPageResource(overrides = {}) {
  return {
    body: "本文",
    contentType: "portfolio",
    createdAt: "2026-01-01T00:00:00.000Z",
    id: "page-1",
    slug: "example-page",
    status: "draft",
    title: "Example Page",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

export function createContentCollectionResource(overrides = {}) {
  return {
    createdAt: "2026-01-01T00:00:00.000Z",
    id: "collection-1",
    name: "Example Collection",
    slug: "example-collection",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

export function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json"
    },
    status
  });
}
