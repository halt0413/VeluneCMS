import type { CmsPageCreateRequest } from "@repo/types";
import { ContentEditorPage } from "../../../../components/content/editor/ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../../../../components/content/editor/ContentForm/ContentForm";

type NewContentPageProps = {
  isSubmitting?: boolean;
  onSubmit?: (payload: CmsPageCreateRequest) => void | Promise<void>;
};

export function NewContentPage({
  isSubmitting = false,
  onSubmit
}: NewContentPageProps) {
  return (
    <ContentEditorPage title="コンテンツ新規作成">
      <ContentForm
        defaultValue={{
          slug: "new-content",
          title: "",
          body: "",
          contentType: "work",
          status: "draft"
        }}
        description="CMS から新しいコンテンツを作成するためのフォームです。"
        endpoint="/contents"
        isSubmitting={isSubmitting}
        method="POST"
        onSubmit={onSubmit}
        showStatus={false}
        submitLabel="作成する"
      />
    </ContentEditorPage>
  );
}
