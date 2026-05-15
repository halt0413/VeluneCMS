import { useQuery } from "@tanstack/react-query";
import { getContentUseCase } from "../application/getContentUseCase";

export function useContentQuery(id: string) {
  return useQuery({
    queryFn: () => getContentUseCase(id),
    queryKey: ["contents", id]
  });
}
