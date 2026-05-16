import type { CmsPageUpdateRequest } from "@repo/types";
import { ContentEditorPage } from "../../../../components/content/editor/ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../../../../components/content/editor/ContentForm/ContentForm";
import type { Content } from "../../../../domain/content/content";
import styles from "./EditContentPage.module.css";

type EditContentPageProps = {
  content: Content | null;
  errorMessage?: string;
  isSubmitting?: boolean;
  onSubmit?: (payload: CmsPageUpdateRequest) => void | Promise<void>;
};

export function EditContentPage({
  content,
  errorMessage,
  isSubmitting = false,
  onSubmit
}: EditContentPageProps) {
  return (
    <ContentEditorPage
      subtitle={content ? `ID: ${content.id}` : "対象コンテンツが見つかりません。"}
      title="コンテンツ編集"
    >
      {content ? (
        <ContentForm
          defaultValue={{
            slug: content.slug,
            title: content.title,
            body: content.body,
            contentType: content.contentType,
            status: content.status
          }}
          description="既存コンテンツを更新するための編集フォームです。"
          endpoint={`/contents/${content.id}`}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          method="PATCH"
          onSubmit={onSubmit}
          showDelete
          showStatus={false}
          submitLabel="更新する"
        />
      ) : (
        <section className={styles.detailCard}>
          <p className={styles.body}>
            指定したコンテンツは存在しないか、取得できませんでした。
          </p>
        </section>
      )}
    </ContentEditorPage>
  );
}
