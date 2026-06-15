import { Page } from "../../../src/domain";
import { createPage } from "../../../src/usecase/page";
import type {
  AuthUser,
  CmsPageId,
  CmsPageInput,
  PageRepository
} from "../../../src/domain";

export class TestPageRepository implements PageRepository {
  private readonly pages = new Map<CmsPageId, Page>();

  async delete(id: CmsPageId): Promise<void> {
    this.pages.delete(id);
  }

  async findById(id: CmsPageId): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async findBySlug(slug: string): Promise<Page | undefined> {
    return Array.from(this.pages.values()).find((page) => page.slug === slug);
  }

  async list(): Promise<Page[]> {
    return Array.from(this.pages.values());
  }

  async save(page: Page): Promise<Page> {
    this.pages.set(page.id, page);
    return page;
  }
}

export function createAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    avatarUrl: "https://example.com/avatar.png",
    email: null,
    id: 1,
    login: "example-user",
    name: null,
    profileUrl: "https://example.com/example-user",
    ...overrides
  };
}

export function createPageInput(
  overrides: Partial<CmsPageInput> = {}
): CmsPageInput {
  return {
    body: "本文",
    contentType: "portfolio",
    slug: "my page",
    status: "draft",
    title: "タイトル",
    ...overrides
  };
}

export function createPageDependencies(pageRepository: PageRepository) {
  return {
    createId: () => "page-1",
    getNow: () => "2026-01-01T00:00:00.000Z",
    pageRepository
  };
}

export async function createRepositoryWithPage() {
  const actor = createAuthUser();
  const pageRepository = new TestPageRepository();

  await createPage(
    createPageInput(),
    createPageDependencies(pageRepository),
    actor
  );

  return {
    actor,
    pageRepository
  };
}
