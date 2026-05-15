import type { ContentCollection as ApiContentCollection } from "@repo/types";
import {
  ContentCollection,
  type ContentCollectionInput,
  type ContentCollectionRepository
} from "../domain";

type CreateContentCollectionDependencies = {
  contentCollectionRepository: ContentCollectionRepository;
  createId: () => string;
  getNow: () => string;
};

export async function createContentCollection(
  input: ContentCollectionInput,
  {
    contentCollectionRepository,
    createId,
    getNow
  }: CreateContentCollectionDependencies
): Promise<ApiContentCollection> {
  const collection = ContentCollection.create({
    id: createId(),
    input,
    now: getNow()
  });
  const saved = await contentCollectionRepository.save(collection);

  return saved.toSnapshot();
}

export async function listContentCollections(
  contentCollectionRepository: ContentCollectionRepository
): Promise<ApiContentCollection[]> {
  const collections = await contentCollectionRepository.list();

  return collections.map((collection) => collection.toSnapshot());
}
