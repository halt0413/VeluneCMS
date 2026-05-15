import { useParams } from "@tanstack/react-router";
import { useContentQuery } from "../../features/contents/hooks/useContentQuery";
import { ContentDetailPage } from "../../features/contents/ui/detail/cards/ContentDetailPage/ContentDetailPage";

export function ContentDetailRoute() {
  const { id } = useParams({ from: "/contents/$id" });
  const { data: content = null, isPending } = useContentQuery(id);

  if (isPending) {
    return <p>読み込み中...</p>;
  }

  return <ContentDetailPage content={content} />;
}
