import { contentApi } from "../../../infrastructure/content/contentApi";

export async function getContentUseCase(id: string) {
  return contentApi.get(id);
}
