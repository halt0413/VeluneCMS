import { useNavigate, useParams } from "@tanstack/react-router";
import { LoadingMessage } from "../../components/feedback/LoadingMessage/LoadingMessage";
import { useDeleteContentCollectionMutation } from "../../features/contentCollectionEdit/hooks/useDeleteContentCollectionMutation";
import { useContentCollectionQuery } from "../../features/contentCollectionEdit/hooks/useContentCollectionQuery";
import { useUpdateContentCollectionMutation } from "../../features/contentCollectionEdit/hooks/useUpdateContentCollectionMutation";
import { EditContentCollectionPage } from "../../features/contentCollectionEdit/ui/EditContentCollectionPage/EditContentCollectionPage";
import { useRequireCurrentUser } from "../../hooks/useRequireCurrentUser";

export function EditContentCollectionRoute() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/content-collections/$id/edit" });
  const { isCheckingAuth } = useRequireCurrentUser(
    `/content-collections/${id}/edit`
  );
  const { data: collection = null, isPending } = useContentCollectionQuery(id);
  const deleteMutation = useDeleteContentCollectionMutation(id);
  const updateMutation = useUpdateContentCollectionMutation(id);
  async function handleDelete() {
    await deleteMutation.mutateAsync();
    await navigate({ to: "/contents" });
  }

  async function handleSubmit(
    payload: Parameters<typeof updateMutation.mutateAsync>[0]
  ) {
    const updated = await updateMutation.mutateAsync(payload);
    await navigate({
      search: { collection: updated.slug },
      to: "/contents"
    });
  }

  if (isCheckingAuth) {
    return <LoadingMessage>GitHub ログインへ移動します...</LoadingMessage>;
  }

  if (isPending) {
    return <LoadingMessage />;
  }

  return (
    <EditContentCollectionPage
      collection={collection}
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
