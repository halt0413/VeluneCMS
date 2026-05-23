export type ContentCollectionResource = {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

export type ContentCollectionCreateRequest = {
  name: string;
  slug: string;
};

export type ContentCollectionCreateResponse = {
  created: ContentCollectionResource;
};

export type ContentCollectionListResponse = {
  items: ContentCollectionResource[];
  total: number;
};
