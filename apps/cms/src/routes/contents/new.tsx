import { useLocation, useNavigate } from "@tanstack/react-router";
import { LoadingMessage } from "../../components/feedback/LoadingMessage/LoadingMessage";
import { useContentCollectionsQuery } from "../../features/contentCollectionList/hooks/useContentCollectionsQuery";
import { useCreateContentMutation } from "../../features/contentCreate/hooks/useCreateContentMutation";
import { NewContentPage } from "../../features/contentCreate/ui/NewContentPage/NewContentPage";
import { useRequireCurrentUser } from "../../hooks/useRequireCurrentUser";

export function NewContentRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCheckingAuth } = useRequireCurrentUser("/contents/new");
  const { data: collections = [] } = useContentCollectionsQuery();
  const createMutation = useCreateContentMutation();
  const collectionSlug =
    new URLSearchParams(location.searchStr).get("collection") ?? "portfolio";
  const collection = collections.find((item) => item.slug === collectionSlug);

  if (isCheckingAuth) {
    return <LoadingMessage>GitHub ログインへ移動します...</LoadingMessage>;
  }

  return (
    <NewContentPage
      collectionName={collection?.name ?? collectionSlug}
      contentType={collectionSlug}
      errorMessage={createMutation.error?.message}
      isSubmitting={createMutation.isPending}
      onSubmit={async (payload) => {
        const created = await createMutation.mutateAsync(payload);
        await navigate({ to: "/contents/$id", params: { id: created.id } });
      }}
    />
  );
}
