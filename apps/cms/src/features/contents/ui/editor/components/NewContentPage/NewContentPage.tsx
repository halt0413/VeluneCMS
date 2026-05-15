import { ContentEditorPage } from "../ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../ContentForm/ContentForm";

export function NewContentPage() {
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
        method="POST"
        showStatus={false}
        submitLabel="作成する"
      />
    </ContentEditorPage>
  );
}
