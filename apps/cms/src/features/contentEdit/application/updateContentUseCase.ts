import type { CmsPageUpdateRequest } from "@repo/types";
import { contentApi } from "../../../infrastructure/content/contentApi";

type UpdateContentUseCaseInput = {
  id: string;
  payload: CmsPageUpdateRequest;
};

export async function updateContentUseCase({
  id,
  payload
}: UpdateContentUseCaseInput) {
  return contentApi.update(id, payload);
}
