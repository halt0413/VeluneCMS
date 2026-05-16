import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const pages = sqliteTable(
  "pages",
  {
    body: text("body").notNull(),
    contentType: text("content_type").notNull(),
    createdByGitHubId: integer("created_by_github_id"),
    createdByGitHubLogin: text("created_by_github_login"),
    createdAt: text("created_at").notNull(),
    id: text("id").primaryKey(),
    publishedAt: text("published_at"),
    slug: text("slug").notNull(),
    status: text("status").notNull(),
    title: text("title").notNull(),
    updatedByGitHubId: integer("updated_by_github_id"),
    updatedByGitHubLogin: text("updated_by_github_login"),
    updatedAt: text("updated_at").notNull()
  },
  (table) => [
    uniqueIndex("pages_slug_unique").on(table.slug),
    index("idx_pages_status").on(table.status),
    index("idx_pages_content_type").on(table.contentType),
    index("idx_pages_updated_at").on(table.updatedAt),
    check("pages_status_check", sql`${table.status} in ('draft', 'published')`),
    check(
      "pages_published_at_check",
      sql`(
        (${table.status} = 'draft' and ${table.publishedAt} is null) or
        (${table.status} = 'published' and ${table.publishedAt} is not null)
      )`
    )
  ]
);
