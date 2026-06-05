import type { CmsPageInput } from "../../../../infrastructure/content/types";
import { useCallback, useState } from "react";
import { Button } from "../../../ui/Button/Button";
import { ContentFormSidebar } from "../ContentFormSidebar/ContentFormSidebar";
import styles from "./ContentForm.module.css";

export type ContentFormValue = CmsPageInput & {
  contentType: string;
};

type ContentFormProps = {
  defaultValue: ContentFormValue;
  description: string;
  endpoint: string;
  errorMessage?: string;
  method: "POST" | "PATCH";
  isSubmitting?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void | Promise<void>;
  onSubmit?: (value: ContentFormValue) => void | Promise<void>;
  showDelete?: boolean;
  showStatus?: boolean;
  submitLabel: string;
};

export function ContentForm({
  defaultValue,
  description,
  errorMessage,
  isDeleting = false,
  isSubmitting = false,
  onDelete,
  onSubmit,
  showDelete = false,
  showStatus = true,
  submitLabel,
}: ContentFormProps) {
  const [submittingIntent, setSubmittingIntent] = useState<
    "draft" | "save" | null
  >(null);
  const pendingIntent = isSubmitting ? submittingIntent : null;

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      event.preventDefault();

      if (!onSubmit) {
        return;
      }

      const submitter = event.nativeEvent.submitter;
      // 同じformで「下書き保存」と「更新」を分けるため、押されたsubmit buttonのvalueを保存意図として扱う
      const intent =
        submitter instanceof HTMLButtonElement && submitter.value === "draft"
          ? "draft"
          : "save";
      const formData = new FormData(event.currentTarget);
      setSubmittingIntent(intent);

      try {
        await onSubmit({
          body: String(formData.get("body") ?? ""),
          contentType: String(
            formData.get("contentType") ?? defaultValue.contentType,
          ),
          slug: String(formData.get("slug") ?? ""),
          status:
            intent === "draft"
              ? "draft"
              : showStatus
                ? (String(
                    formData.get("status") ?? defaultValue.status,
                  ) as CmsPageInput["status"])
                : "published",
          title: String(formData.get("title") ?? ""),
        });
      } finally {
        setSubmittingIntent(null);
      }
    },
    [defaultValue.contentType, defaultValue.status, onSubmit, showStatus],
  );

  return (
    <section className={styles.formLayout}>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <div>
            <h3 className={styles.sectionTitle}>コンテンツ入力</h3>
          </div>
        </div>

        <p className={styles.formDescription}>{description}</p>
        {errorMessage ? (
          <p className={styles.errorMessage}>{errorMessage}</p>
        ) : null}

        <div className={styles.fieldGrid}>
          <label className={styles.field} htmlFor="content-title">
            <span className={styles.fieldLabel}>タイトル</span>
            <input
              aria-label="タイトル"
              defaultValue={defaultValue.title}
              id="content-title"
              name="title"
              required
              type="text"
            />
          </label>

          <label className={styles.field} htmlFor="content-slug">
            <span className={styles.fieldLabel}>slug</span>
            <input
              aria-label="slug"
              defaultValue={defaultValue.slug}
              id="content-slug"
              name="slug"
              required
              type="text"
            />
          </label>
        </div>

        <label className={styles.field} htmlFor="content-type">
          <span className={styles.fieldLabel}>種別</span>
          <input
            aria-label="種別"
            defaultValue={defaultValue.contentType}
            id="content-type"
            name="contentType"
            required
            type="text"
          />
        </label>

        {showStatus ? (
          <label className={styles.field} htmlFor="content-status">
            <span className={styles.fieldLabel}>ステータス</span>
            <select
              defaultValue={defaultValue.status}
              id="content-status"
              name="status"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>
        ) : null}

        <label className={styles.field} htmlFor="content-body">
          <span className={styles.fieldLabel}>本文</span>
          <textarea
            aria-label="本文"
            defaultValue={defaultValue.body}
            id="content-body"
            name="body"
            required
            rows={10}
          />
        </label>

        <div className={styles.formActions}>
          <div className={styles.formActionsLeft}>
            {showDelete ? (
              <Button
                disabled={!onDelete || isSubmitting || isDeleting}
                onClick={onDelete}
                type="button"
                variant="danger"
              >
                {isDeleting ? "削除中..." : "削除"}
              </Button>
            ) : null}
          </div>
          <div className={styles.formActionsRight}>
            {pendingIntent === "draft" ? (
              <output className={styles.pendingMessage}>
                下書きを保存しています...
              </output>
            ) : null}
            <Button
              disabled={!onSubmit || isSubmitting}
              type="submit"
              value="draft"
            >
              {pendingIntent === "draft" ? "保存中..." : "下書き保存"}
            </Button>
            <Button
              disabled={!onSubmit || isSubmitting}
              type="submit"
              value="save"
              variant="primary"
            >
              {pendingIntent === "save" ? "保存中..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>

      <ContentFormSidebar description={description} showStatus={showStatus} />
    </section>
  );
}
