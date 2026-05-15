import type { CmsPageUpdateRequest } from "@repo/types";
import type { Content } from "../../../../../../domain/content/content";
import { ContentEditorPage } from "../ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../ContentForm/ContentForm";
import styles from "./EditContentPage.module.css";

type EditContentPageProps = {
  content: Content | null;
  isSubmitting?: boolean;
  onSubmit?: (payload: CmsPageUpdateRequest) => void | Promise<void>;
};

export function EditContentPage({
  content,
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
            モックデータ上に該当 ID がないため、編集画面を描画できません。
          </p>
        </section>
      )}
    </ContentEditorPage>
  );
}
