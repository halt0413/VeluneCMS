import { useContentsQuery } from "../../features/contentList/hooks/useContentsQuery";
import { ContentsPage } from "../../features/contentList/ui/ContentsPage/ContentsPage";

export function ContentsRoute() {
  const { data = [] } = useContentsQuery();

  return <ContentsPage contents={data} />;
}
