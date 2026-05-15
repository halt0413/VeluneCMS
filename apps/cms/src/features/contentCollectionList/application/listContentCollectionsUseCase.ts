import { contentCollectionApi } from "../../../infrastructure/contentCollection/contentCollectionApi";

export async function listContentCollectionsUseCase() {
  return contentCollectionApi.list();
}
