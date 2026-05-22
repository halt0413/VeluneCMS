import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { LoadingMessage } from "../../components/feedback/LoadingMessage/LoadingMessage";
import { useDeleteContentMutation } from "../../features/contentEdit/hooks/useDeleteContentMutation";
import { useEditableContentQuery } from "../../features/contentEdit/hooks/useEditableContentQuery";
import { useUpdateContentMutation } from "../../features/contentEdit/hooks/useUpdateContentMutation";
import { EditContentPage } from "../../features/contentEdit/ui/EditContentPage/EditContentPage";
import { useRequireCurrentUser } from "../../hooks/useRequireCurrentUser";

export function EditContentRoute() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/contents/$id/edit" });
  const { isCheckingAuth } = useRequireCurrentUser(`/contents/${id}/edit`);
  const { data: content = null, isPending } = useEditableContentQuery(id);
  const deleteMutation = useDeleteContentMutation(id);
  const updateMutation = useUpdateContentMutation(id);
  const handleDelete = useCallback(async () => {
    await deleteMutation.mutateAsync();
    // 削除後は元のcollection一覧に戻す contentが取れない場合だけ既定のportfolioへ戻る
    await navigate({
      search: { collection: content?.contentType ?? "portfolio" },
      to: "/contents"
    });
  }, [content?.contentType, deleteMutation, navigate]);
  const handleSubmit = useCallback(
    async (payload: Parameters<typeof updateMutation.mutateAsync>[0]) => {
      const updated = await updateMutation.mutateAsync(payload);
      await navigate({ to: "/contents/$id", params: { id: updated.id } });
    },
    [navigate, updateMutation]
  );

  if (isCheckingAuth) {
    return <LoadingMessage>GitHub ログインへ移動します...</LoadingMessage>;
  }

  if (isPending) {
    return <LoadingMessage />;
  }

  return (
    <EditContentPage
      content={content}
      errorMessage={
        updateMutation.error || deleteMutation.error
          ? "保存または削除に失敗しました。ログイン状態と入力内容を確認してください。"
          : undefined
      }
      isDeleting={deleteMutation.isPending}
      isSubmitting={updateMutation.isPending}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
    />
  );
}
