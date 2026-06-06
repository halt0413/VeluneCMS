import { contentCollectionApi } from "../../../infrastructure/contentCollection/contentCollectionApi";

export async function deleteContentCollectionUseCase(id: string) {
  return contentCollectionApi.delete(id);
}
