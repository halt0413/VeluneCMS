import type { CmsPageCreateRequest } from "../../../infrastructure/content/types";
import { contentApi } from "../../../infrastructure/content/contentApi";

export async function createContentUseCase(payload: CmsPageCreateRequest) {
  return contentApi.create(payload);
}
