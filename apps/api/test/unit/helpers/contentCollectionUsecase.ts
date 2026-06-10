import { ContentCollection } from "../../../src/domain";
import { createContentCollection } from "../../../src/usecase/contentCollection";
import type {
  ContentCollectionId,
  ContentCollectionInput,
  ContentCollectionRepository
} from "../../../src/domain";

export class TestContentCollectionRepository
  implements ContentCollectionRepository
{
  private readonly collections = new Map<string, ContentCollection>();

  async delete(id: ContentCollectionId): Promise<void> {
    this.collections.delete(id);
  }

  async findById(
    id: ContentCollectionId
  ): Promise<ContentCollection | undefined> {
    return this.collections.get(id);
  }

  async findBySlug(slug: string): Promise<ContentCollection | undefined> {
    return Array.from(this.collections.values()).find(
      (collection) => collection.slug === slug
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

export function createCollectionInput(
  overrides: Partial<ContentCollectionInput> = {}
): ContentCollectionInput {
  return {
    name: "Portfolio",
    slug: "my portfolio",
    ...overrides
  };
}

export function createCollectionDependencies(
  contentCollectionRepository: ContentCollectionRepository
) {
  return {
    contentCollectionRepository,
    createId: () => "collection-1",
    getNow: () => "2026-01-01T00:00:00.000Z"
  };
}

export async function createRepositoryWithCollection() {
  const contentCollectionRepository = new TestContentCollectionRepository();

  await createContentCollection(
    createCollectionInput(),
    createCollectionDependencies(contentCollectionRepository)
  );

  return contentCollectionRepository;
}
