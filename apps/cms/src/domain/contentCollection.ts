import type { ContentCollectionResource } from "../infrastructure/contentCollection/types";

export type ContentCollection = {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

export function toContentCollection(
  collection: ContentCollectionResource,
): ContentCollection {
  return {
    createdAt: collection.createdAt,
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    updatedAt: collection.updatedAt,
  };
}
