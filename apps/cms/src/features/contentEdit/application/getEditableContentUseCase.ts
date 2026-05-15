import { contentApi } from "../../../infrastructure/content/contentApi";

export async function getEditableContentUseCase(id: string) {
  return contentApi.get(id);
}
