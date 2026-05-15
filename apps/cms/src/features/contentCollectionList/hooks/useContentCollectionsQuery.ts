import { useQuery } from "@tanstack/react-query";
import { listContentCollectionsUseCase } from "../application/listContentCollectionsUseCase";

export function useContentCollectionsQuery() {
  return useQuery({
    queryFn: listContentCollectionsUseCase,
    queryKey: ["contentCollections"]
  });
}
