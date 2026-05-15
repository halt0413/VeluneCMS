import { useNavigate, useParams } from "@tanstack/react-router";
import { LoadingMessage } from "../../components/feedback/LoadingMessage/LoadingMessage";
import { useEditableContentQuery } from "../../features/contentEdit/hooks/useEditableContentQuery";
import { useUpdateContentMutation } from "../../features/contentEdit/hooks/useUpdateContentMutation";
import { EditContentPage } from "../../features/contentEdit/ui/EditContentPage/EditContentPage";
import { useRequireCurrentUser } from "../../hooks/useRequireCurrentUser";

export function EditContentRoute() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/contents/$id/edit" });
  const { isCheckingAuth } = useRequireCurrentUser(`/contents/${id}/edit`);
  const { data: content = null, isPending } = useEditableContentQuery(id);
  const updateMutation = useUpdateContentMutation(id);

  if (isCheckingAuth) {
    return <LoadingMessage>GitHub ログインへ移動します...</LoadingMessage>;
  }

  if (isPending) {
    return <LoadingMessage />;
  }

  return (
    <EditContentPage
      content={content}
      isSubmitting={updateMutation.isPending}
      onSubmit={async (payload) => {
        const updated = await updateMutation.mutateAsync(payload);
        await navigate({ to: "/contents/$id", params: { id: updated.id } });
      }}
    />
  );
}
