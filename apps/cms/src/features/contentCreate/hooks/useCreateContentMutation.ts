import type { CmsPageCreateRequest } from "../../../infrastructure/content/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Content } from "../../../domain/content/content";
import { createContentUseCase } from "../application/createContentUseCase";

export function useCreateContentMutation() {
  const queryClient = useQueryClient();

  return useMutation<Content, Error, CmsPageCreateRequest>({
    mutationFn: createContentUseCase,
    onSuccess: async (created) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contents"] }),
        queryClient.invalidateQueries({ queryKey: ["contents", created.id] })
      ]);
    }
  });
}
