import { contentCollectionApi } from "../../../infrastructure/contentCollection/contentCollectionApi";

export async function getContentCollectionUseCase(id: string) {
  return contentCollectionApi.get(id);
}
