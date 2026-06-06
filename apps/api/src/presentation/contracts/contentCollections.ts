import type { ContentCollectionSnapshot } from "../../domain";
import type { ApiItemResponse, ApiListResponse } from "./common";

export type ContentCollectionCreateRequest = Pick<
  ContentCollectionSnapshot,
  "name" | "slug"
>;

export type ContentCollectionCreateResponse = {
  created: ContentCollectionSnapshot;
};

export type ContentCollectionUpdateRequest =
  Partial<ContentCollectionCreateRequest>;

export type ContentCollectionUpdateResponse = {
  updated: ContentCollectionSnapshot;
};

export type ContentCollectionDeleteResponse = {
  deleted: true;
  id: string;
};

export type ContentCollectionListResponse =
  ApiListResponse<ContentCollectionSnapshot>;

export type ContentCollectionItemResponse =
  ApiItemResponse<ContentCollectionSnapshot>;
