import type { CmsPageUpdateRequest } from "@repo/types";
import { updateContent } from "../infrastructure";

type UpdateContentUseCaseInput = {
  id: string;
  payload: CmsPageUpdateRequest;
};

export async function updateContentUseCase({
  id,
  payload
}: UpdateContentUseCaseInput) {
  return updateContent(id, payload);
}
