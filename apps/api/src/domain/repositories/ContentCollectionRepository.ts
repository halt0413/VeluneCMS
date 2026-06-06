import type { ContentCollection } from "../entities/ContentCollection";

export interface ContentCollectionRepository {
  delete(id: string): Promise<void>;
  findById(id: string): Promise<ContentCollection | undefined>;
  findBySlug(slug: string): Promise<ContentCollection | undefined>;
  list(): Promise<ContentCollection[]>;
  save(collection: ContentCollection): Promise<ContentCollection>;
}
