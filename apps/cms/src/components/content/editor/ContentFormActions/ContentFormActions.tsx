import { memo } from "react";
import { Button } from "../../../ui/Button/Button";
import styles from "./ContentFormActions.module.css";

export type ContentFormSubmitIntent = "draft" | "save";

type ContentFormActionsProps = {
  isDeleting: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  onDelete?: () => void | Promise<void>;
  pendingIntent: ContentFormSubmitIntent | null;
  showDelete: boolean;
  submitLabel: string;
};

export const ContentFormActions = memo(function ContentFormActions({
  isDeleting,
  isSubmitting,
  canSubmit,
  onDelete,
  pendingIntent,
  showDelete,
  submitLabel
}: ContentFormActionsProps) {
  return (
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
          disabled={!canSubmit || isSubmitting}
          type="submit"
          value="draft"
        >
          {pendingIntent === "draft" ? "保存中..." : "下書き保存"}
        </Button>
        <Button
          disabled={!canSubmit || isSubmitting}
          type="submit"
          value="save"
          variant="primary"
        >
          {pendingIntent === "save" ? "保存中..." : submitLabel}
        </Button>
      </div>
    </div>
  );
});
