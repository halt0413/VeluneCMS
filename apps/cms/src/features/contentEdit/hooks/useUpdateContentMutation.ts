import type { CmsPageUpdateRequest } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Content } from "../../../domain/content/content";
import { updateContentUseCase } from "../application/updateContentUseCase";

export function useUpdateContentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Content, Error, CmsPageUpdateRequest>({
    mutationFn: (payload: CmsPageUpdateRequest) =>
      updateContentUseCase({ id, payload }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contents"] }),
        queryClient.invalidateQueries({ queryKey: ["contents", id] }),
        queryClient.invalidateQueries({ queryKey: ["contents", updated.id] })
      ]);
    }
  });
}
