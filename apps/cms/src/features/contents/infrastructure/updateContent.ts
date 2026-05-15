import type { CmsPageUpdateRequest, CmsPageUpdateResponse } from "@repo/types";
import { toContent, type Content } from "../../../domain/content/content";
import { cmsFetch } from "../../../api/cms/client";

export async function updateContent(
  id: string,
  payload: CmsPageUpdateRequest
): Promise<Content> {
  const response = await cmsFetch<CmsPageUpdateResponse>(`/contents/${id}`, {
    body: JSON.stringify(payload),
    method: "PATCH"
  });

  return toContent(response.updated);
}
