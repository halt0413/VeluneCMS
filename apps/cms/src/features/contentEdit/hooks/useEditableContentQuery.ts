import { useQuery } from "@tanstack/react-query";
import { getEditableContentUseCase } from "../application/getEditableContentUseCase";

export function useEditableContentQuery(id: string) {
  return useQuery({
    queryFn: () => getEditableContentUseCase(id),
    queryKey: ["contents", id]
  });
}
