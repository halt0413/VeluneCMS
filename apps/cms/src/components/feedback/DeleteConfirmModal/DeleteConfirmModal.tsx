import { memo } from "react";
import { Button } from "../../ui/Button/Button";
import styles from "./DeleteConfirmModal.module.css";

type DeleteConfirmModalProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
};

export const DeleteConfirmModal = memo(function DeleteConfirmModal({
  cancelLabel = "キャンセル",
  confirmLabel = "削除",
  description,
  isDeleting,
  onCancel,
  onConfirm,
  title
}: DeleteConfirmModalProps) {
  return (
    <div className={styles.modalBackdrop} role="presentation">
      <dialog
        aria-labelledby="delete-confirm-title"
        className={styles.modal}
        open
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="delete-confirm-title">
            {title}
          </h2>
          <Button
            aria-label="閉じる"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
            variant="icon"
          >
            ×
          </Button>
        </div>
        <p className={styles.modalBody}>{description}</p>
        <div className={styles.modalActions}>
          <Button disabled={isDeleting} onClick={onCancel} type="button">
            {cancelLabel}
          </Button>
          <Button
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
            variant="danger"
          >
            {isDeleting ? "削除中..." : confirmLabel}
          </Button>
        </div>
      </dialog>
    </div>
  );
});
