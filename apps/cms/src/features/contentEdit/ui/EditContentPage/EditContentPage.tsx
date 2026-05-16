import type { CmsPageUpdateRequest } from "@repo/types";
import { useState } from "react";
import { ContentEditorPage } from "../../../../components/content/editor/ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../../../../components/content/editor/ContentForm/ContentForm";
import type { Content } from "../../../../domain/content/content";
import styles from "./EditContentPage.module.css";

type EditContentPageProps = {
  content: Content | null;
  errorMessage?: string;
  isDeleting?: boolean;
  isSubmitting?: boolean;
  onDelete?: () => void | Promise<void>;
  onSubmit?: (payload: CmsPageUpdateRequest) => void | Promise<void>;
};

export function EditContentPage({
  content,
  errorMessage,
  isDeleting = false,
  isSubmitting = false,
  onDelete,
  onSubmit
}: EditContentPageProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleDelete() {
    if (!onDelete) {
      return;
    }

    await onDelete();
    setIsDeleteModalOpen(false);
  }

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
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
          method="PATCH"
          onDelete={() => setIsDeleteModalOpen(true)}
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
      {content && isDeleteModalOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section
            aria-labelledby="delete-content-title"
            aria-modal="true"
            className={styles.modal}
            role="dialog"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} id="delete-content-title">
                コンテンツを削除
              </h2>
              <button
                aria-label="閉じる"
                className={styles.iconButton}
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <p className={styles.modalBody}>
              「{content.title}」を削除します。この操作は取り消せません。
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                type="button"
              >
                キャンセル
              </button>
              <button
                className={styles.deleteButton}
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </ContentEditorPage>
  );
}
