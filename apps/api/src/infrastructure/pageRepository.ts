import {
  Page,
  Slug,
  type CmsPageId,
  type CmsPageInput,
  type PageRepository
} from "../domain";
import type { D1Database } from "./db/d1";

type PageRow = {
  body: string;
  content_type: string;
  created_by_github_id: number | null;
  created_by_github_login: string | null;
  created_at: string;
  id: string;
  owner_github_id: number | null;
  owner_github_login: string | null;
  published_at: string | null;
  slug: string;
  status: "draft" | "published";
  title: string;
  updated_by_github_id: number | null;
  updated_by_github_login: string | null;
  updated_at: string;
};

const seedPages: Array<{ id: string; input: CmsPageInput; now: string }> = [
  {
    id: "seed-welcome",
    input: {
      slug: "welcome",
      title: "Welcome",
      body: "Initial CMS page",
      contentType: "portfolio",
      status: "published"
    },
    now: "2026-03-26T00:00:00.000Z"
  },
  {
    id: "seed-roadmap",
    input: {
      slug: "roadmap",
      title: "Roadmap",
      body: "Draft page for upcoming updates",
      contentType: "portfolio",
      status: "draft"
    },
    now: "2026-03-26T00:00:00.000Z"
  }
];

export class D1PageRepository implements PageRepository {
  constructor(private readonly database: D1Database) {}

  async delete(id: CmsPageId): Promise<void> {
    await this.database.prepare("delete from pages where id = ?").bind(id).run();
  }

  async findById(id: CmsPageId): Promise<Page | undefined> {
    const row = await this.database
      .prepare(
        `
          select id, slug, title, body, status, published_at, created_at, updated_at, content_type,
                 created_by_github_id, created_by_github_login,
                 owner_github_id, owner_github_login,
                 updated_by_github_id, updated_by_github_login
          from pages
          where id = ?
        `
      )
      .bind(id)
      .first<PageRow>();

    return row ? this.toPage(row) : undefined;
  }

  async findBySlug(slug: string): Promise<Page | undefined> {
    const normalizedSlug = Slug.create(slug).toString();
    const row = await this.database
      .prepare(
        `
          select id, slug, title, body, status, published_at, created_at, updated_at, content_type,
                 created_by_github_id, created_by_github_login,
                 owner_github_id, owner_github_login,
                 updated_by_github_id, updated_by_github_login
          from pages
          where slug = ?
        `
      )
      .bind(normalizedSlug)
      .first<PageRow>();

    return row ? this.toPage(row) : undefined;
  }

  async list(): Promise<Page[]> {
    const result = await this.database.prepare(
      `
        select id, slug, title, body, status, published_at, created_at, updated_at, content_type,
               created_by_github_id, created_by_github_login,
               owner_github_id, owner_github_login,
               updated_by_github_id, updated_by_github_login
        from pages
        order by updated_at desc
      `
    ).all<PageRow>();

    return (result.results ?? []).map((row) => this.toPage(row));
  }

  async save(page: Page): Promise<Page> {
    const snapshot = page.toSnapshot();

    // ownerはコンテンツの所属ユーザーなので、既存行の更新では上書きしない
    await this.database
      .prepare(
        `
          insert into pages (
            id,
            slug,
            title,
            body,
            content_type,
            created_by_github_id,
            created_by_github_login,
            owner_github_id,
            owner_github_login,
            updated_by_github_id,
            updated_by_github_login,
            status,
            published_at,
            created_at,
            updated_at
          ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          on conflict(id) do update set
            slug = excluded.slug,
            title = excluded.title,
            body = excluded.body,
            content_type = excluded.content_type,
            created_by_github_id = excluded.created_by_github_id,
            created_by_github_login = excluded.created_by_github_login,
            owner_github_id = coalesce(pages.owner_github_id, excluded.owner_github_id),
            owner_github_login = coalesce(pages.owner_github_login, excluded.owner_github_login),
            updated_by_github_id = excluded.updated_by_github_id,
            updated_by_github_login = excluded.updated_by_github_login,
            status = excluded.status,
            published_at = excluded.published_at,
            created_at = excluded.created_at,
            updated_at = excluded.updated_at
        `
      )
      .bind(
        snapshot.id,
        snapshot.slug,
        snapshot.title,
        snapshot.body,
        snapshot.contentType,
        snapshot.createdBy?.id ?? null,
        snapshot.createdBy?.login ?? null,
        snapshot.owner?.id ?? null,
        snapshot.owner?.login ?? null,
        snapshot.updatedBy?.id ?? null,
        snapshot.updatedBy?.login ?? null,
        snapshot.status,
        snapshot.status === "published" ? snapshot.publishedAt : null,
        snapshot.createdAt,
        snapshot.updatedAt
      )
      .run();

    return page;
  }

  private toPage(row: PageRow): Page {
    // DBのnull表現をドメインのoptional userへ戻し、公開日時の整合性はPage.reconstituteに任せる
    if (row.status === "published" && row.published_at) {
      return Page.reconstitute({
        id: row.id,
        slug: row.slug,
        title: row.title,
        body: row.body,
        contentType: row.content_type,
        createdBy: toGitHubUser(row.created_by_github_id, row.created_by_github_login),
        owner: toGitHubUser(row.owner_github_id, row.owner_github_login),
        status: "published",
        updatedBy: toGitHubUser(row.updated_by_github_id, row.updated_by_github_login),
        publishedAt: row.published_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    }

    return Page.reconstitute({
      id: row.id,
      slug: row.slug,
      title: row.title,
      body: row.body,
      contentType: row.content_type,
      createdBy: toGitHubUser(row.created_by_github_id, row.created_by_github_login),
      owner: toGitHubUser(row.owner_github_id, row.owner_github_login),
      status: "draft",
      updatedBy: toGitHubUser(row.updated_by_github_id, row.updated_by_github_login),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}

function toGitHubUser(id: number | null, login: string | null) {
  return id !== null && login
    ? {
        id,
        login
      }
    : undefined;
}

export class InMemoryPageRepository implements PageRepository {
  private readonly pages = new Map<CmsPageId, Page>();

  constructor() {
    for (const seed of seedPages) {
      const page = Page.create({
        id: seed.id,
        input: seed.input,
        now: seed.now
      });

      this.pages.set(page.id, page);
    }
  }

  async findById(id: CmsPageId): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async delete(id: CmsPageId): Promise<void> {
    this.pages.delete(id);
  }

  async findBySlug(slug: string): Promise<Page | undefined> {
    const normalizedSlug = Slug.create(slug).toString();

    return (await this.list()).find((page) => page.slug === normalizedSlug);
  }

  async list(): Promise<Page[]> {
    return Array.from(this.pages.values()).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    );
  }

  async save(page: Page): Promise<Page> {
    this.pages.set(page.id, page);
    return page;
  }
}
