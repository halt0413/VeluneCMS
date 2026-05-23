import type { ContentCollectionSnapshot } from "../../domain";
import type { ApiItemResponse, ApiListResponse } from "./common";

export type ContentCollectionCreateRequest = Pick<
  ContentCollectionSnapshot,
  "name" | "slug"
>;

export type ContentCollectionCreateResponse = {
  created: ContentCollectionSnapshot;
};

export type ContentCollectionListResponse =
  ApiListResponse<ContentCollectionSnapshot>;

export type ContentCollectionItemResponse =
  ApiItemResponse<ContentCollectionSnapshot>;
