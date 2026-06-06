import type {
  ContentCollectionCreateRequest,
  ContentCollectionCreateResponse,
  ContentCollectionDeleteResponse,
  ContentCollectionItemResponse,
  ContentCollectionListResponse,
  ContentCollectionUpdateRequest,
  ContentCollectionUpdateResponse,
} from "./types";
import { cmsFetch } from "../../api/cms/client";
import {
  toContentCollection,
  type ContentCollection,
} from "../../domain/contentCollection";

const CONTENT_COLLECTION_PATH = "/content-collections";

// content collectionの通信詳細はここに閉じ、features側はuse case経由で呼び出す
export const contentCollectionApi = {
  async list(): Promise<ContentCollection[]> {
    const response = await cmsFetch<ContentCollectionListResponse>(
      CONTENT_COLLECTION_PATH,
    );
    return response.items.map(toContentCollection);
  },

  async get(id: string): Promise<ContentCollection> {
    const response = await cmsFetch<ContentCollectionItemResponse>(
      `${CONTENT_COLLECTION_PATH}/${id}`,
    );

    return toContentCollection(response.item);
  },

  async create(
    payload: ContentCollectionCreateRequest,
  ): Promise<ContentCollection> {
    const response = await cmsFetch<ContentCollectionCreateResponse>(
      CONTENT_COLLECTION_PATH,
      {
        body: JSON.stringify(payload),
        method: "POST",
      },
    );

    return toContentCollection(response.created);
  },

  async update(
    id: string,
    payload: ContentCollectionUpdateRequest,
  ): Promise<ContentCollection> {
    const response = await cmsFetch<ContentCollectionUpdateResponse>(
      `${CONTENT_COLLECTION_PATH}/${id}`,
      {
        body: JSON.stringify(payload),
        method: "PATCH",
      },
    );

    return toContentCollection(response.updated);
  },

  async delete(id: string): Promise<ContentCollectionDeleteResponse> {
    return cmsFetch<ContentCollectionDeleteResponse>(
      `${CONTENT_COLLECTION_PATH}/${id}`,
      {
        method: "DELETE",
      },
    );
  },
};
