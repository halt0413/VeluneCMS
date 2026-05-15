import { getContent } from "../infrastructure";

export async function getContentUseCase(id: string) {
  return getContent(id);
}
