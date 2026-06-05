import type { ContentCollectionCreateRequest } from "../../../../infrastructure/contentCollection/types";
import { useCallback } from "react";
import { PageHeader } from "../../../../components/content/PageHeader/PageHeader";
import {
  FormField,
  getFormControlClassName
} from "../../../../components/form/FormField/FormField";
import { Button } from "../../../../components/ui/Button/Button";
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
        <FormField htmlFor="collection-name" label="名前">
          <input
            aria-label="名前"
            className={getFormControlClassName()}
            id="collection-name"
            name="name"
            type="text"
          />
        </FormField>
        <FormField htmlFor="collection-slug" label="slug">
          <input
            aria-label="slug"
            className={getFormControlClassName()}
            id="collection-slug"
            name="slug"
            type="text"
          />
        </FormField>
        <Button
          className={styles.submitButton}
          disabled={isSubmitting}
          type="submit"
          variant="primary"
        >
          追加
        </Button>
      </form>
    </main>
  );
}
