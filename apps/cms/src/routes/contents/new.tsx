import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
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
  // 「コンテンツ追加」は選択中collection配下に作るため、URL queryからcontentTypeを決める
  const collectionSlug =
    new URLSearchParams(location.searchStr).get("collection") ?? "portfolio";
  const collection = collections.find((item) => item.slug === collectionSlug);
  const handleSubmit = useCallback(
    async (payload: Parameters<typeof createMutation.mutateAsync>[0]) => {
      const created = await createMutation.mutateAsync(payload);
      await navigate({ to: "/contents/$id", params: { id: created.id } });
    },
    [createMutation, navigate]
  );

  if (isCheckingAuth) {
    return <LoadingMessage>GitHub ログインへ移動します...</LoadingMessage>;
  }

  return (
    <NewContentPage
      collectionName={collection?.name ?? collectionSlug}
      contentType={collectionSlug}
      errorMessage={createMutation.error?.message}
      isSubmitting={createMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}
