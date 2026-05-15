import { useContentsQuery } from "../../features/contents/hooks/useContentsQuery";
import { ContentsPage } from "../../features/contents/ui/list/components/ContentsPage/ContentsPage";

export function ContentsRoute() {
  const { data = [] } = useContentsQuery();

  return <ContentsPage contents={data} />;
}
