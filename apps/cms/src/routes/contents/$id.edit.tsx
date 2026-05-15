import { useNavigate, useParams } from "@tanstack/react-router";
import { useContentQuery } from "../../features/contents/hooks/useContentQuery";
import { useUpdateContentMutation } from "../../features/contents/hooks/useUpdateContentMutation";
import { EditContentPage } from "../../features/contents/ui/editor/components/EditContentPage/EditContentPage";

export function EditContentRoute() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/contents/$id/edit" });
  const { data: content = null, isPending } = useContentQuery(id);
  const updateMutation = useUpdateContentMutation(id);

  if (isPending) {
    return <p>読み込み中...</p>;
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
