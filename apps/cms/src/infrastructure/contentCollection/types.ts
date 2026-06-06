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

export type ContentCollectionUpdateRequest =
  Partial<ContentCollectionCreateRequest>;

export type ContentCollectionCreateResponse = {
  created: ContentCollectionResource;
};

export type ContentCollectionUpdateResponse = {
  updated: ContentCollectionResource;
};

export type ContentCollectionDeleteResponse = {
  deleted: true;
  id: string;
};

export type ContentCollectionItemResponse = {
  item: ContentCollectionResource;
};

export type ContentCollectionListResponse = {
  items: ContentCollectionResource[];
  total: number;
};
