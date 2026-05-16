import {
  Page,
  type GitHubIssueGateway,
  type PageRepository,
  type AuthUser,
  type CmsPage,
  type CmsPageId,
  type CmsPageInput,
  type CmsPagePatch
} from "../domain";
import { NotFoundError } from "../lib/errors/AppError";

export type PagePreview = CmsPage;

export type SyncPageToGitHubResult = {
  issue: Awaited<ReturnType<GitHubIssueGateway["createFromPage"]>>;
  pageId: string;
};

type CreatePageDependencies = {
  createId: () => string;
  getNow: () => string;
  pageRepository: PageRepository;
};

type UpdatePageDependencies = {
  getNow: () => string;
  pageRepository: PageRepository;
};

type SyncPageToGitHubDependencies = {
  gitHubIssueGateway: GitHubIssueGateway;
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
  id: CmsPageId
): Promise<{ deleted: true; id: CmsPageId }> {
  const page = await pageRepository.findById(id);

  if (!page) {
    throw new NotFoundError("Page not found");
  }

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

export async function syncPageToGitHub(
  pageId: string,
  { gitHubIssueGateway, pageRepository }: SyncPageToGitHubDependencies
): Promise<SyncPageToGitHubResult> {
  const page = await pageRepository.findById(pageId);

  if (!page) {
    throw new NotFoundError("Page not found");
  }

  const snapshot = page.toSnapshot();
  const issue = await gitHubIssueGateway.createFromPage(snapshot);

  return {
    pageId: snapshot.id,
    issue
  };
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
