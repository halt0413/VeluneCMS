import {
  Page,
  type PageRepository,
  type AuthUser,
  type CmsPage,
  type CmsPageId,
  type CmsPageInput,
  type CmsPagePatch
} from "../domain";
import { NotFoundError } from "../lib/errors/AppError";

export type PagePreview = CmsPage;

type CreatePageDependencies = {
  createId: () => string;
  getNow: () => string;
  pageRepository: PageRepository;
};

type UpdatePageDependencies = {
  getNow: () => string;
  pageRepository: PageRepository;
};

export async function createPage(
  input: CmsPageInput,
  { createId, getNow, pageRepository }: CreatePageDependencies,
  actor?: AuthUser
): Promise<CmsPage> {
  const page = Page.create({
    actor: actor
      ? {
          id: actor.id,
          login: actor.login
        }
      : undefined,
    id: createId(),
    input,
    now: getNow()
  });
  const saved = await pageRepository.save(page);

  return saved.toSnapshot();
}

export async function deletePage(
  pageRepository: PageRepository,
  id: CmsPageId,
  actor?: AuthUser
): Promise<{ deleted: true; id: CmsPageId }> {
  const page = await pageRepository.findById(id);

  if (!page) {
    throw new NotFoundError("Page not found");
  }

  assertPageOwner(page.toSnapshot(), actor);

  await pageRepository.delete(id);

  return {
    deleted: true,
    id
  };
}

export async function getPage(
  pageRepository: PageRepository,
  id: CmsPageId
): Promise<CmsPage> {
  const page = await pageRepository.findById(id);

  if (!page) {
    throw new NotFoundError("Page not found");
  }

  return page.toSnapshot();
}

export async function getPagePreview(
  pageRepository: PageRepository,
  slug: string
): Promise<PagePreview> {
  const page = await pageRepository.findBySlug(slug);

  if (!page) {
    throw new NotFoundError("Page not found");
  }

  return page.toSnapshot();
}

export async function getPagePreviewById(
  pageRepository: PageRepository,
  id: string
): Promise<PagePreview> {
  const page = await pageRepository.findById(id);

  if (!page) {
    throw new NotFoundError("Page not found");
  }

  return page.toSnapshot();
}

export async function listPages(
  pageRepository: PageRepository
): Promise<CmsPage[]> {
  const pages = await pageRepository.list();

  return pages.map((page) => page.toSnapshot());
}

export async function updatePage(
  id: CmsPageId,
  patch: CmsPagePatch,
  { getNow, pageRepository }: UpdatePageDependencies,
  actor?: AuthUser
): Promise<CmsPage> {
  const current = await pageRepository.findById(id);

  if (!current) {
    throw new NotFoundError("Page not found");
  }

  assertPageOwner(current.toSnapshot(), actor);

  current.update(
    patch,
    getNow(),
    actor
      ? {
          id: actor.id,
          login: actor.login
        }
      : undefined
  );
  const updated = await pageRepository.save(current);

  return updated.toSnapshot();
}

function assertPageOwner(page: CmsPage, actor?: AuthUser): void {
  if (!actor || !page.owner) {
    return;
  }

  if (page.owner.id !== actor.id) {
    throw new NotFoundError("Page not found");
  }
}
