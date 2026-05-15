import type { CmsPageInput } from "@repo/types";
import { ContentFormSidebar } from "../ContentFormSidebar/ContentFormSidebar";
import styles from "./ContentForm.module.css";

export type ContentFormValue = CmsPageInput & {
  contentType: string;
};

type ContentFormProps = {
  defaultValue: ContentFormValue;
  description: string;
  endpoint: string;
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
  isSubmitting = false,
  method,
  onSubmit,
  showDelete = false,
  showStatus = true,
  submitLabel
}: ContentFormProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    await onSubmit({
      body: String(formData.get("body") ?? ""),
      contentType: String(formData.get("contentType") ?? defaultValue.contentType),
      slug: String(formData.get("slug") ?? ""),
      status: showStatus
        ? (String(formData.get("status") ?? defaultValue.status) as CmsPageInput["status"])
        : defaultValue.status,
      title: String(formData.get("title") ?? "")
    });
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

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>タイトル</span>
            <input defaultValue={defaultValue.title} name="title" type="text" />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>slug</span>
            <input defaultValue={defaultValue.slug} name="slug" type="text" />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>種別</span>
          <input defaultValue={defaultValue.contentType} name="contentType" type="text" />
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
          <textarea defaultValue={defaultValue.body} name="body" rows={10} />
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
            <button className={styles.secondaryButton} disabled={isSubmitting} type="button">
              下書き保存
            </button>
            <button className={styles.primaryButton} disabled={isSubmitting} type="submit">
              {submitLabel}
            </button>
          </div>
        </div>
      </form>

      <ContentFormSidebar description={description} showStatus={showStatus} />
    </section>
  );
}
