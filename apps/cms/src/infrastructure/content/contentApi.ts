import type {
  CmsPageCreateRequest,
  CmsPageDeleteResponse,
  CmsPageUpdateRequest
} from "./types";
import { cmsFetch } from "../../api/cms/client";
import { toContent, type Content } from "../../domain/content";
import {
  cmsPageCreateResponseSchema,
  cmsPageDeleteResponseSchema,
  cmsPageItemResponseSchema,
  cmsPageListResponseSchema,
  cmsPageUpdateResponseSchema
} from "./schema";

const CONTENT_PATH = "/contents";

// infrastructure層ではHTTP responseを画面用domain型へ変換し、featuresにはAPI shapeを漏らさない
export const contentApi = {
  async list(): Promise<Content[]> {
    const response = cmsPageListResponseSchema.parse(
      await cmsFetch<unknown>(CONTENT_PATH)
    );
    return response.items.map(toContent);
  },

  async get(id: string): Promise<Content> {
    const response = cmsPageItemResponseSchema.parse(
      await cmsFetch<unknown>(`${CONTENT_PATH}/${id}`)
    );
    return toContent(response.item);
  },

  async create(payload: CmsPageCreateRequest): Promise<Content> {
    const response = cmsPageCreateResponseSchema.parse(
      await cmsFetch<unknown>(CONTENT_PATH, {
        body: JSON.stringify(payload),
        method: "POST"
      })
    );

    return toContent(response.created);
  },

  async update(id: string, payload: CmsPageUpdateRequest): Promise<Content> {
    const response = cmsPageUpdateResponseSchema.parse(
      await cmsFetch<unknown>(`${CONTENT_PATH}/${id}`, {
        body: JSON.stringify(payload),
        method: "PATCH"
      })
    );

    return toContent(response.updated);
  },

  async delete(id: string): Promise<CmsPageDeleteResponse> {
    return cmsPageDeleteResponseSchema.parse(
      await cmsFetch<unknown>(`${CONTENT_PATH}/${id}`, {
        method: "DELETE"
      })
    );
  }
};
