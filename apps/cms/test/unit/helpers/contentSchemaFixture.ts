export function createPageResourceBase() {
  return {
    body: "本文",
    contentType: "portfolio",
    createdAt: "2026-01-01T00:00:00.000Z",
    id: "page-1",
    slug: "welcome",
    title: "Welcome",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };
}

export function createDraftPageResource() {
  return {
    ...createPageResourceBase(),
    status: "draft"
  };
}

export function createPublishedPageResource() {
  return {
    ...createPageResourceBase(),
    publishedAt: "2026-01-02T00:00:00.000Z",
    status: "published"
  };
}
