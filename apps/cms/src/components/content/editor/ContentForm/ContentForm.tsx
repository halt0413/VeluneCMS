import type { CmsPageInput } from "@repo/types";
import { useState } from "react";
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
  onSubmit?: (value: ContentFormValue) => void | Promise<void>;
  showDelete?: boolean;
  showStatus?: boolean;
  submitLabel: string;
};

export function ContentForm({
  defaultValue,
  description,
  errorMessage,
  isSubmitting = false,
  method,
  onSubmit,
  showDelete = false,
  showStatus = true,
  submitLabel
}: ContentFormProps) {
  const [submittingIntent, setSubmittingIntent] = useState<"draft" | "save" | null>(
    null
  );
  const pendingIntent = isSubmitting ? submittingIntent : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const intent =
      submitter instanceof HTMLButtonElement && submitter.value === "draft"
        ? "draft"
        : "save";
    const formData = new FormData(event.currentTarget);
    setSubmittingIntent(intent);

    try {
      await onSubmit({
        body: String(formData.get("body") ?? ""),
        contentType: String(formData.get("contentType") ?? defaultValue.contentType),
        slug: String(formData.get("slug") ?? ""),
        status:
          intent === "draft"
            ? "draft"
            : showStatus
              ? (String(formData.get("status") ?? defaultValue.status) as CmsPageInput["status"])
              : "published",
        title: String(formData.get("title") ?? "")
      });
    } finally {
      setSubmittingIntent(null);
    }
  }

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
          <label className={styles.field}>
            <span className={styles.fieldLabel}>タイトル</span>
            <input defaultValue={defaultValue.title} name="title" required type="text" />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>slug</span>
            <input defaultValue={defaultValue.slug} name="slug" required type="text" />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>種別</span>
          <input
            defaultValue={defaultValue.contentType}
            name="contentType"
            required
            type="text"
          />
        </label>

        {showStatus ? (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>ステータス</span>
            <select defaultValue={defaultValue.status} name="status">
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>
        ) : null}

        <label className={styles.field}>
          <span className={styles.fieldLabel}>本文</span>
          <textarea defaultValue={defaultValue.body} name="body" required rows={10} />
        </label>

        <div className={styles.formActions}>
          <div className={styles.formActionsLeft}>
            {showDelete ? (
              <button className={`${styles.secondaryButton} ${styles.deleteButton}`} type="button">
                削除
              </button>
            ) : null}
          </div>
          <div className={styles.formActionsRight}>
            {pendingIntent === "draft" ? (
              <span className={styles.pendingMessage} role="status">
                下書きを保存しています...
              </span>
            ) : null}
            <button
              className={styles.secondaryButton}
              disabled={!onSubmit || isSubmitting}
              type="submit"
              value="draft"
            >
              {pendingIntent === "draft" ? "保存中..." : "下書き保存"}
            </button>
            <button
              className={styles.primaryButton}
              disabled={!onSubmit || isSubmitting}
              type="submit"
              value="save"
            >
              {pendingIntent === "save" ? "保存中..." : submitLabel}
            </button>
          </div>
        </div>
      </form>

      <ContentFormSidebar description={description} showStatus={showStatus} />
    </section>
  );
}
