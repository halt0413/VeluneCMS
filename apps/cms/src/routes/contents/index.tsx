import { useLocation } from "@tanstack/react-router";
import { useContentCollectionsQuery } from "../../features/contentCollectionList/hooks/useContentCollectionsQuery";
import { useContentsQuery } from "../../features/contentList/hooks/useContentsQuery";
import { ContentsPage } from "../../features/contentList/ui/ContentsPage/ContentsPage";

export function ContentsRoute() {
  const location = useLocation();
  const { data = [] } = useContentsQuery();
  const { data: collections = [] } = useContentCollectionsQuery();
  const collectionSlug =
    new URLSearchParams(location.searchStr).get("collection") ?? "portfolio";
  const collection = collections.find((item) => item.slug === collectionSlug);
  const filteredContents = data.filter(
    (content) => content.contentType === collectionSlug
  );

  return (
    <ContentsPage
      collectionName={collection?.name ?? collectionSlug}
      collectionSlug={collectionSlug}
      contents={filteredContents}
    />
  );
}
