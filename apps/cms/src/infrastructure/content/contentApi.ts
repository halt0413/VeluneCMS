import type {
  CmsPageCreateRequest,
  CmsPageCreateResponse,
  CmsPageDeleteResponse,
  CmsPageItemResponse,
  CmsPageListResponse,
  CmsPageUpdateRequest,
  CmsPageUpdateResponse
} from "./types";
import { cmsFetch } from "../../api/cms/client";
import { toContent, type Content } from "../../domain/content/content";

const CONTENT_PATH = "/contents";

// infrastructure層ではHTTP responseを画面用domain型へ変換し、featuresにはAPI shapeを漏らさない
export const contentApi = {
  async list(): Promise<Content[]> {
    const response = await cmsFetch<CmsPageListResponse>(CONTENT_PATH);
    return response.items.map(toContent);
  },

  async get(id: string): Promise<Content> {
    const response = await cmsFetch<CmsPageItemResponse>(
      `${CONTENT_PATH}/${id}`
    );
    return toContent(response.item);
  },

  async create(payload: CmsPageCreateRequest): Promise<Content> {
    const response = await cmsFetch<CmsPageCreateResponse>(CONTENT_PATH, {
      body: JSON.stringify(payload),
      method: "POST"
    });

    return toContent(response.created);
  },

  async update(id: string, payload: CmsPageUpdateRequest): Promise<Content> {
    const response = await cmsFetch<CmsPageUpdateResponse>(
      `${CONTENT_PATH}/${id}`,
      {
        body: JSON.stringify(payload),
        method: "PATCH"
      }
    );

    return toContent(response.updated);
  },

  async delete(id: string): Promise<CmsPageDeleteResponse> {
    return cmsFetch<CmsPageDeleteResponse>(`${CONTENT_PATH}/${id}`, {
      method: "DELETE"
    });
  }
};
