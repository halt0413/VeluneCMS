import type { ContentCollectionUpdateRequest } from "../../../infrastructure/contentCollection/types";
import { contentCollectionApi } from "../../../infrastructure/contentCollection/contentCollectionApi";

type UpdateContentCollectionUseCaseInput = {
  id: string;
  payload: ContentCollectionUpdateRequest;
};

export async function updateContentCollectionUseCase({
  id,
  payload
}: UpdateContentCollectionUseCaseInput) {
  return contentCollectionApi.update(id, payload);
}
