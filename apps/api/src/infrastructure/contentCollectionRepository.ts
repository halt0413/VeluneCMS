import {
  ContentCollection,
  Slug,
  type ContentCollectionInput,
  type ContentCollectionRepository
} from "../domain";
import type { D1Database } from "./db/d1";

type ContentCollectionRow = {
  created_at: string;
  id: string;
  name: string;
  slug: string;
  updated_at: string;
};

const seedCollections: Array<{
  id: string;
  input: ContentCollectionInput;
  now: string;
}> = [
  {
    id: "collection-portfolio",
    input: {
      name: "portfolio",
      slug: "portfolio"
    },
    now: "2026-03-26T00:00:00.000Z"
  }
];

export class D1ContentCollectionRepository
  implements ContentCollectionRepository
{
  constructor(private readonly database: D1Database) {}

  async findBySlug(slug: string): Promise<ContentCollection | undefined> {
    const normalizedSlug = Slug.create(slug).toString();
    const row = await this.database
      .prepare(
        `
          select id, slug, name, created_at, updated_at
          from content_collections
          where slug = ?
        `
      )
      .bind(normalizedSlug)
      .first<ContentCollectionRow>();

    return row ? this.toContentCollection(row) : undefined;
  }

  async list(): Promise<ContentCollection[]> {
    const result = await this.database
      .prepare(
        `
          select id, slug, name, created_at, updated_at
          from content_collections
          order by created_at asc
        `
      )
      .all<ContentCollectionRow>();

    return (result.results ?? []).map((row) => this.toContentCollection(row));
  }

  async save(collection: ContentCollection): Promise<ContentCollection> {
    const snapshot = collection.toSnapshot();

    await this.database
      .prepare(
        `
          insert into content_collections (
            id,
            slug,
            name,
            created_at,
            updated_at
          ) values (?, ?, ?, ?, ?)
          on conflict(id) do update set
            slug = excluded.slug,
            name = excluded.name,
            created_at = excluded.created_at,
            updated_at = excluded.updated_at
        `
      )
      .bind(
        snapshot.id,
        snapshot.slug,
        snapshot.name,
        snapshot.createdAt,
        snapshot.updatedAt
      )
      .run();

    return collection;
  }

  private toContentCollection(row: ContentCollectionRow): ContentCollection {
    return ContentCollection.reconstitute({
      id: row.id,
      slug: row.slug,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}

export class InMemoryContentCollectionRepository
  implements ContentCollectionRepository
{
  private readonly collections = new Map<string, ContentCollection>();

  constructor() {
    for (const seed of seedCollections) {
      const collection = ContentCollection.create(seed);
      this.collections.set(collection.id, collection);
    }
  }

  async findBySlug(slug: string): Promise<ContentCollection | undefined> {
    const normalizedSlug = Slug.create(slug).toString();

    return (await this.list()).find(
      (collection) => collection.slug === normalizedSlug
    );
  }

  async list(): Promise<ContentCollection[]> {
    return Array.from(this.collections.values());
  }

  async save(collection: ContentCollection): Promise<ContentCollection> {
    this.collections.set(collection.id, collection);
    return collection;
  }
}
