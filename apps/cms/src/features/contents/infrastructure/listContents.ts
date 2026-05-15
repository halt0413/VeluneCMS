import type { CmsPageListResponse } from "@repo/types";
import { toContent, type Content } from "../../../domain/content/content";
import { cmsFetch } from "../../../api/cms/client";

export async function listContents(): Promise<Content[]> {
  const response = await cmsFetch<CmsPageListResponse>("/contents");
  return response.items.map(toContent);
}
