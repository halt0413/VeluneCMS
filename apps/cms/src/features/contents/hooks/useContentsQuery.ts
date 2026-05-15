import { useQuery } from "@tanstack/react-query";
import { listContentsUseCase } from "../application/listContentsUseCase";

export function useContentsQuery() {
  return useQuery({
    queryFn: listContentsUseCase,
    queryKey: ["contents"]
  });
}
