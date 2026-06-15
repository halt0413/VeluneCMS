import { useNavigate } from "@tanstack/react-router";
import { LoadingMessage } from "../../components/feedback/LoadingMessage/LoadingMessage";
import { useCreateContentCollectionMutation } from "../../features/contentCollectionCreate/hooks/useCreateContentCollectionMutation";
import { NewContentCollectionPage } from "../../features/contentCollectionCreate/ui/NewContentCollectionPage/NewContentCollectionPage";
import { useRequireCurrentUser } from "../../hooks/useRequireCurrentUser";

export function NewContentCollectionRoute() {
  const navigate = useNavigate();
  const { isCheckingAuth } = useRequireCurrentUser("/content-collections/new");
  const createMutation = useCreateContentCollectionMutation();
  async function handleSubmit(
    payload: Parameters<typeof createMutation.mutateAsync>[0]
  ) {
    await createMutation.mutateAsync(payload);
    await navigate({ to: "/contents" });
  }

  if (isCheckingAuth) {
    return <LoadingMessage>GitHub ログインへ移動します...</LoadingMessage>;
  }

  return (
    <NewContentCollectionPage
      isSubmitting={createMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}
