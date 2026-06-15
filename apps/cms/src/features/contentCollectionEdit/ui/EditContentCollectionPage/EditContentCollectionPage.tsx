import type { ContentCollectionUpdateRequest } from "../../../../infrastructure/contentCollection/types";
import { useState } from "react";
import { PageHeader } from "../../../../components/content/PageHeader/PageHeader";
import { DeleteConfirmModal } from "../../../../components/feedback/DeleteConfirmModal/DeleteConfirmModal";
import {
  FormField,
  getFormControlClassName
} from "../../../../components/form/FormField/FormField";
import { Button } from "../../../../components/ui/Button/Button";
import type { ContentCollection } from "../../../../domain/contentCollection";
import { getValidationErrorMessage } from "../../../../lib/validation";
import { contentCollectionInputSchema } from "../../../../infrastructure/contentCollection/schema";
import styles from "./EditContentCollectionPage.module.css";

type EditContentCollectionPageProps = {
  collection: ContentCollection | null;
  errorMessage?: string;
  isDeleting?: boolean;
  isSubmitting?: boolean;
  onDelete?: () => void | Promise<void>;
  onSubmit?: (payload: ContentCollectionUpdateRequest) => void | Promise<void>;
};

export function EditContentCollectionPage({
  collection,
  errorMessage,
  isDeleting = false,
  isSubmitting = false,
  onDelete,
  onSubmit
}: EditContentCollectionPageProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function openDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  async function confirmDelete() {
    if (!onDelete) {
      return;
    }

    await onDelete();
    setIsDeleteModalOpen(false);
  }

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const parsed = contentCollectionInputSchema.safeParse({
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? "")
    });

    if (!parsed.success) {
      setValidationError(getValidationErrorMessage(parsed.error));
      return;
    }

    setValidationError(null);
    await onSubmit(parsed.data);
  }

  return (
    <main className={styles.page}>
      <PageHeader
        subtitle={collection ? `ID: ${collection.id}` : undefined}
        title="コンテンツ種別を編集"
      />
      {collection ? (
        <form className={styles.formCard} onSubmit={handleSubmit}>
          {errorMessage || validationError ? (
            <p className={styles.errorMessage}>
              {errorMessage ?? validationError}
            </p>
          ) : null}
          <FormField htmlFor="collection-name" label="名前">
            <input
              aria-label="名前"
              className={getFormControlClassName()}
              defaultValue={collection.name}
              id="collection-name"
              name="name"
              required
              type="text"
            />
          </FormField>
          <FormField htmlFor="collection-slug" label="slug">
            <input
              aria-label="slug"
              className={getFormControlClassName()}
              defaultValue={collection.slug}
              id="collection-slug"
              name="slug"
              required
              type="text"
            />
          </FormField>
          <div className={styles.actions}>
            <Button
              disabled={!onDelete || isDeleting || isSubmitting}
              onClick={openDeleteModal}
              type="button"
              variant="danger"
            >
              {isDeleting ? "削除中..." : "削除"}
            </Button>
            <div className={styles.primaryActions}>
              <Button
                disabled={!onSubmit || isSubmitting}
                type="submit"
                variant="primary"
              >
                {isSubmitting ? "保存中..." : "更新する"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <section className={styles.detailCard}>
          <p className={styles.body}>
            指定したコンテンツ種別は存在しないか、取得できませんでした。
          </p>
        </section>
      )}
      {collection && isDeleteModalOpen ? (
        <DeleteConfirmModal
          description={`「${collection.name}」を削除します。この操作は取り消せません。`}
          isDeleting={isDeleting}
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
          title="コンテンツ種別を削除"
        />
      ) : null}
    </main>
  );
}
