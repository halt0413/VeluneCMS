import { useQuery } from "@tanstack/react-query";
import { getContentCollectionUseCase } from "../application/getContentCollectionUseCase";

export function useContentCollectionQuery(id: string) {
  return useQuery({
    queryFn: () => getContentCollectionUseCase(id),
    queryKey: ["contentCollections", id]
  });
}
