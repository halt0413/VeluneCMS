import type { ContentCollection } from "@repo/types";

export type { ContentCollection };

export function toContentCollection(
  collection: ContentCollection
): ContentCollection {
  // collectionもdomain境界を通しておき、API shape変更時にfeatures側へ影響を広げない
  return collection;
}
