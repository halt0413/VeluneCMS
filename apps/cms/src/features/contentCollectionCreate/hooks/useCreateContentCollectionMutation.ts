import type { ContentCollectionCreateRequest } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContentCollection } from "../../../domain/contentCollection/contentCollection";
import { createContentCollectionUseCase } from "../application/createContentCollectionUseCase";

export function useCreateContentCollectionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ContentCollection,
    Error,
    ContentCollectionCreateRequest
  >({
    mutationFn: createContentCollectionUseCase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["contentCollections"]
      });
    }
  });
}
