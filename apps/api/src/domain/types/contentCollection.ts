export type ContentCollectionId = string;

export type ContentCollectionInput = {
  name: string;
  slug: string;
};

export type ContentCollectionPatch = Partial<ContentCollectionInput>;

export type ContentCollectionSnapshot = ContentCollectionInput & {
  id: ContentCollectionId;
  createdAt: string;
  updatedAt: string;
};
