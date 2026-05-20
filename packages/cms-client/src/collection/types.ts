export type ContentCollection = {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

export type CollectionClient = {
  listContentCollections(): Promise<ContentCollection[]>;
};

export type ContentCollectionListResponse = {
  items: ContentCollection[];
  total: number;
};
