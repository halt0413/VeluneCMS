import type { CmsPageItemResponse } from "@repo/types";
import { toContent, type Content } from "../../../domain/content/content";
import { cmsFetch } from "../../../api/cms/client";

export async function getContent(id: string): Promise<Content> {
  const response = await cmsFetch<CmsPageItemResponse>(`/contents/${id}`);
  return toContent(response.item);
}
