import { contentApi } from "../../../infrastructure/content/contentApi";

export async function deleteContentUseCase(id: string) {
  return contentApi.delete(id);
}
