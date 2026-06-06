import type { ContentCollectionCreateRequest } from "../../../../infrastructure/contentCollection/types";
import { memo, useCallback, useState } from "react";
import { PageHeader } from "../../../../components/content/PageHeader/PageHeader";
import {
  FormField,
  getFormControlClassName
} from "../../../../components/form/FormField/FormField";
import { Button } from "../../../../components/ui/Button/Button";
import { getValidationErrorMessage } from "../../../../lib/validation";
import { contentCollectionInputSchema } from "../../../../infrastructure/contentCollection/schema";
import styles from "./NewContentCollectionPage.module.css";

type NewContentCollectionPageProps = {
  isSubmitting?: boolean;
  onSubmit?: (payload: ContentCollectionCreateRequest) => void | Promise<void>;
};

export const NewContentCollectionPage = memo(function NewContentCollectionPage({
  isSubmitting = false,
  onSubmit
}: NewContentCollectionPageProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
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
    },
    [onSubmit]
  );

  return (
    <main className={styles.page}>
      <PageHeader title="コンテンツ種別を追加" />
      <form className={styles.formCard} onSubmit={handleSubmit}>
        {validationError ? (
          <p className={styles.errorMessage}>{validationError}</p>
        ) : null}
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
});
