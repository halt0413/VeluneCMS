import type { ContentCollectionUpdateRequest } from "../../../infrastructure/contentCollection/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContentCollection } from "../../../domain/contentCollection";
import { updateContentCollectionUseCase } from "../application/updateContentCollectionUseCase";

export function useUpdateContentCollectionMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<ContentCollection, Error, ContentCollectionUpdateRequest>({
    mutationFn: (payload) => updateContentCollectionUseCase({ id, payload }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contentCollections"] }),
        queryClient.invalidateQueries({
          queryKey: ["contentCollections", id]
        }),
        queryClient.invalidateQueries({
          queryKey: ["contentCollections", updated.id]
        })
      ]);
    }
  });
}
