import type { CmsPageCreateRequest } from "@repo/types";
import { contentApi } from "../../../infrastructure/content/contentApi";

export async function createContentUseCase(payload: CmsPageCreateRequest) {
  return contentApi.create(payload);
}
