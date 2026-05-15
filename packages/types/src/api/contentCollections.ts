import type {
  ContentCollection,
  ContentCollectionInput
} from "../models/contentCollection";
import type { ApiItemResponse, ApiListResponse } from "./common";

export type ContentCollectionCreateRequest = ContentCollectionInput;

export type ContentCollectionCreateResponse = {
  created: ContentCollection;
};

export type ContentCollectionListResponse =
  ApiListResponse<ContentCollection>;

export type ContentCollectionItemResponse =
  ApiItemResponse<ContentCollection>;
