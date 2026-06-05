import type { CmsPageUpdateRequest } from "../../../../infrastructure/content/types";
import { useCallback, useMemo, useState } from "react";
import { ContentEditorPage } from "../../../../components/content/editor/ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../../../../components/content/editor/ContentForm/ContentForm";
import { Button } from "../../../../components/ui/Button/Button";
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
  const defaultValue = useMemo(
    () =>
      content
        ? {
            slug: content.slug,
            title: content.title,
            body: content.body,
            contentType: content.contentType,
            status: content.status
          }
        : null,
    [content]
  );
  const openDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!onDelete) {
      return;
    }

    await onDelete();
    setIsDeleteModalOpen(false);
  }, [onDelete]);

  return (
    <ContentEditorPage
      subtitle={content ? `ID: ${content.id}` : "対象コンテンツが見つかりません。"}
      title="コンテンツ編集"
    >
      {content && defaultValue ? (
        <ContentForm
          defaultValue={defaultValue}
          description="既存コンテンツを更新するための編集フォームです。"
          endpoint={`/contents/${content.id}`}
          errorMessage={errorMessage}
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
          method="PATCH"
          onDelete={openDeleteModal}
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
          <dialog
            aria-labelledby="delete-content-title"
            className={styles.modal}
            open
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} id="delete-content-title">
                コンテンツを削除
              </h2>
              <Button
                aria-label="閉じる"
                disabled={isDeleting}
                onClick={closeDeleteModal}
                type="button"
                variant="icon"
              >
                ×
              </Button>
            </div>
            <p className={styles.modalBody}>
              「{content.title}」を削除します。この操作は取り消せません。
            </p>
            <div className={styles.modalActions}>
              <Button
                disabled={isDeleting}
                onClick={closeDeleteModal}
                type="button"
              >
                キャンセル
              </Button>
              <Button
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
                variant="danger"
              >
                {isDeleting ? "削除中..." : "削除"}
              </Button>
            </div>
          </dialog>
        </div>
      ) : null}
    </ContentEditorPage>
  );
}
