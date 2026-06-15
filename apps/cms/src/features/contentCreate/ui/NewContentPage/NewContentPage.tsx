import type { CmsPageCreateRequest } from "../../../../infrastructure/content/types";
import { ContentEditorPage } from "../../../../components/content/editor/ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../../../../components/content/editor/ContentForm/ContentForm";

type NewContentPageProps = {
  collectionName?: string;
  contentType?: string;
  errorMessage?: string;
  isSubmitting?: boolean;
  onSubmit?: (payload: CmsPageCreateRequest) => void | Promise<void>;
};

export function NewContentPage({
  collectionName = "portfolio",
  contentType = "portfolio",
  errorMessage,
  isSubmitting = false,
  onSubmit
}: NewContentPageProps) {
  const defaultValue = {
    slug: "new-content",
    title: "",
    body: "",
    contentType,
    status: "draft" as const
  };

  return (
    <ContentEditorPage title={`${collectionName} のコンテンツ追加`}>
      <ContentForm
        defaultValue={defaultValue}
        description={`${collectionName} に表示するコンテンツを作成します。`}
        endpoint="/contents"
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        method="POST"
        onSubmit={onSubmit}
        showStatus={false}
        submitLabel="追加"
      />
    </ContentEditorPage>
  );
}
