import type { ContentCollectionCreateRequest } from "@repo/types";
import { contentCollectionApi } from "../../../infrastructure/contentCollection/contentCollectionApi";

export async function createContentCollectionUseCase(
  payload: ContentCollectionCreateRequest
) {
  return contentCollectionApi.create(payload);
}
