import type {
  ContentCollectionCreateRequest,
  ContentCollectionCreateResponse,
  ContentCollectionListResponse
} from "./types";
import { cmsFetch } from "../../api/cms/client";
import {
  toContentCollection,
  type ContentCollection
} from "../../domain/contentCollection/contentCollection";

const CONTENT_COLLECTION_PATH = "/content-collections";

// content collectionの通信詳細はここに閉じ、features側はuse case経由で呼び出す
export const contentCollectionApi = {
  async list(): Promise<ContentCollection[]> {
    const response = await cmsFetch<ContentCollectionListResponse>(
      CONTENT_COLLECTION_PATH
    );
    return response.items.map(toContentCollection);
  },

  async create(
    payload: ContentCollectionCreateRequest
  ): Promise<ContentCollection> {
    const response = await cmsFetch<ContentCollectionCreateResponse>(
      CONTENT_COLLECTION_PATH,
      {
        body: JSON.stringify(payload),
        method: "POST"
      }
    );

    return toContentCollection(response.created);
  }
};
