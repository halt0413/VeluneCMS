import { contentApi } from "../../../infrastructure/content/contentApi";

export async function listContentsUseCase() {
  return contentApi.list();
}
