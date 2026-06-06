import type { ContentCollectionSnapshot } from "../domain";
import {
  ContentCollection,
  type ContentCollectionId,
  type ContentCollectionInput,
  type ContentCollectionPatch,
  type ContentCollectionRepository
} from "../domain";
import { NotFoundError } from "../lib/errors/AppError";

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
): Promise<ContentCollectionSnapshot> {
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
): Promise<ContentCollectionSnapshot[]> {
  const collections = await contentCollectionRepository.list();

  return collections.map((collection) => collection.toSnapshot());
}

export async function getContentCollection(
  id: ContentCollectionId,
  contentCollectionRepository: ContentCollectionRepository
): Promise<ContentCollectionSnapshot> {
  const collection = await contentCollectionRepository.findById(id);

  if (!collection) {
    throw new NotFoundError("Content collection not found");
  }

  return collection.toSnapshot();
}

export async function updateContentCollection(
  id: ContentCollectionId,
  patch: ContentCollectionPatch,
  {
    contentCollectionRepository,
    getNow
  }: Pick<CreateContentCollectionDependencies, "contentCollectionRepository" | "getNow">
): Promise<ContentCollectionSnapshot> {
  const current = await contentCollectionRepository.findById(id);

  if (!current) {
    throw new NotFoundError("Content collection not found");
  }

  current.update(patch, getNow());
  const saved = await contentCollectionRepository.save(current);

  return saved.toSnapshot();
}

export async function deleteContentCollection(
  id: ContentCollectionId,
  contentCollectionRepository: ContentCollectionRepository
): Promise<{ deleted: true; id: ContentCollectionId }> {
  const current = await contentCollectionRepository.findById(id);

  if (!current) {
    throw new NotFoundError("Content collection not found");
  }

  await contentCollectionRepository.delete(id);

  return {
    deleted: true,
    id
  };
}
