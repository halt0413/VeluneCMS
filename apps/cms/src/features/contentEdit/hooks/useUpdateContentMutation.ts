import type { CmsPageUpdateRequest } from "../../../infrastructure/content/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Content } from "../../../domain/content";
import { updateContentUseCase } from "../application/updateContentUseCase";

export function useUpdateContentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Content, Error, CmsPageUpdateRequest>({
    mutationFn: (payload: CmsPageUpdateRequest) =>
      updateContentUseCase({ id, payload }),
    onSuccess: async (updated) => {
      // 一覧・現在ID・更新後IDをまとめて無効化し、slug/id変更後の画面遷移にも追従する
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contents"] }),
        queryClient.invalidateQueries({ queryKey: ["contents", id] }),
        queryClient.invalidateQueries({ queryKey: ["contents", updated.id] })
      ]);
    }
  });
}
