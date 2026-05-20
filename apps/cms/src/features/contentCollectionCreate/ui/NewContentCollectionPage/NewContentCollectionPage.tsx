import type { ContentCollectionCreateRequest } from "@repo/types";
import { useCallback } from "react";
import { PageHeader } from "../../../../components/content/PageHeader/PageHeader";
import styles from "./NewContentCollectionPage.module.css";

type NewContentCollectionPageProps = {
  isSubmitting?: boolean;
  onSubmit?: (payload: ContentCollectionCreateRequest) => void | Promise<void>;
};

export function NewContentCollectionPage({
  isSubmitting = false,
  onSubmit
}: NewContentCollectionPageProps) {
  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      event.preventDefault();

      if (!onSubmit) {
        return;
      }

      const formData = new FormData(event.currentTarget);
      await onSubmit({
        name: String(formData.get("name") ?? ""),
        slug: String(formData.get("slug") ?? "")
      });
    },
    [onSubmit]
  );

  return (
    <main className={styles.page}>
      <PageHeader title="コンテンツ種別を追加" />
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <label className={styles.field} htmlFor="collection-name">
          <span className={styles.fieldLabel}>名前</span>
          <input aria-label="名前" id="collection-name" name="name" type="text" />
        </label>
        <label className={styles.field} htmlFor="collection-slug">
          <span className={styles.fieldLabel}>slug</span>
          <input aria-label="slug" id="collection-slug" name="slug" type="text" />
        </label>
        <button
          className={styles.primaryButton}
          disabled={isSubmitting}
          type="submit"
        >
          追加
        </button>
      </form>
    </main>
  );
}
