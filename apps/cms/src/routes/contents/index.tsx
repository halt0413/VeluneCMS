import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import { useContentCollectionsQuery } from "../../features/contentCollectionList/hooks/useContentCollectionsQuery";
import { useContentsQuery } from "../../features/contentList/hooks/useContentsQuery";
import { ContentsPage } from "../../features/contentList/ui/ContentsPage/ContentsPage";

export function ContentsRoute() {
  const location = useLocation();
  const { data = [] } = useContentsQuery();
  const { data: collections = [] } = useContentCollectionsQuery();
  // URLのcollectionを現在の作業対象にして、左ナビの選択と一覧表示を同期する
  const collectionSlug =
    new URLSearchParams(location.searchStr).get("collection") ?? "portfolio";
  const collection = collections.find((item) => item.slug === collectionSlug);
  const filteredContents = useMemo(
    () => data.filter((content) => content.contentType === collectionSlug),
    [collectionSlug, data]
  );

  return (
    <ContentsPage
      collectionName={collection?.name ?? collectionSlug}
      collectionSlug={collectionSlug}
      contents={filteredContents}
    />
  );
}
