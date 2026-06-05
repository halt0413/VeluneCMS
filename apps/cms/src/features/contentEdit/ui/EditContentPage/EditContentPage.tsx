import type { CmsPageUpdateRequest } from "../../../../infrastructure/content/types";
import { memo, useMemo, useState } from "react";
import { ContentEditorPage } from "../../../../components/content/editor/ContentEditorPage/ContentEditorPage";
import { ContentForm } from "../../../../components/content/editor/ContentForm/ContentForm";
import { DeleteConfirmModal } from "../../../../components/feedback/DeleteConfirmModal/DeleteConfirmModal";
import type { Content } from "../../../../domain/content";
import styles from "./EditContentPage.module.css";

type EditContentPageProps = {
  content: Content | null;
  errorMessage?: string;
  isDeleting?: boolean;
  isSubmitting?: boolean;
  onDelete?: () => void | Promise<void>;
  onSubmit?: (payload: CmsPageUpdateRequest) => void | Promise<void>;
};

export const EditContentPage = memo(function EditContentPage({
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
  const deleteModalActions = useMemo(
    () => ({
      close() {
        setIsDeleteModalOpen(false);
      },
      async confirm() {
        if (!onDelete) {
          return;
        }

        await onDelete();
        setIsDeleteModalOpen(false);
      },
      open() {
        setIsDeleteModalOpen(true);
      }
    }),
    [onDelete]
  );

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
          onDelete={deleteModalActions.open}
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
        <DeleteConfirmModal
          description={`「${content.title}」を削除します。この操作は取り消せません。`}
          isDeleting={isDeleting}
          onCancel={deleteModalActions.close}
          onConfirm={deleteModalActions.confirm}
          title="コンテンツを削除"
        />
      ) : null}
    </ContentEditorPage>
  );
});
