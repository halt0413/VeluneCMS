import type { ContentCollectionDeleteResponse } from "../../../infrastructure/contentCollection/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContentCollectionUseCase } from "../application/deleteContentCollectionUseCase";

export function useDeleteContentCollectionMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<ContentCollectionDeleteResponse, Error>({
    mutationFn: () => deleteContentCollectionUseCase(id),
    onSuccess: async (deleted) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contentCollections"] }),
        queryClient.removeQueries({
          queryKey: ["contentCollections", deleted.id]
        })
      ]);
    }
  });
}
