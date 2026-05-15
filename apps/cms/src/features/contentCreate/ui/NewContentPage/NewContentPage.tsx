import type { CmsPageCreateRequest } from "@repo/types";
import { ContentEditorPage } from "../../../../components/content/editor/ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../../../../components/content/editor/ContentForm/ContentForm";

type NewContentPageProps = {
  collectionName?: string;
  contentType?: string;
  isSubmitting?: boolean;
  onSubmit?: (payload: CmsPageCreateRequest) => void | Promise<void>;
};

export function NewContentPage({
  collectionName = "portfolio",
  contentType = "portfolio",
  isSubmitting = false,
  onSubmit
}: NewContentPageProps) {
  return (
    <ContentEditorPage title={`${collectionName} のコンテンツ追加`}>
      <ContentForm
        defaultValue={{
          slug: "new-content",
          title: "",
          body: "",
          contentType,
          status: "draft"
        }}
        description={`${collectionName} に表示するコンテンツを作成します。`}
        endpoint="/contents"
        isSubmitting={isSubmitting}
        method="POST"
        onSubmit={onSubmit}
        showStatus={false}
        submitLabel="コンテンツを追加"
      />
    </ContentEditorPage>
  );
}
