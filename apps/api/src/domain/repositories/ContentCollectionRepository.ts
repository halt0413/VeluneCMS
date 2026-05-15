import type { ContentCollection } from "../entities/ContentCollection";

export interface ContentCollectionRepository {
  findBySlug(slug: string): Promise<ContentCollection | undefined>;
  list(): Promise<ContentCollection[]>;
  save(collection: ContentCollection): Promise<ContentCollection>;
}
