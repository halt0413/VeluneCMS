import type { CmsPageDeleteResponse } from "../../../infrastructure/content/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContentUseCase } from "../application/deleteContentUseCase";

export function useDeleteContentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<CmsPageDeleteResponse, Error>({
    mutationFn: () => deleteContentUseCase(id),
    onSuccess: async (deleted) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contents"] }),
        queryClient.removeQueries({ queryKey: ["contents", deleted.id] })
      ]);
    }
  });
}
