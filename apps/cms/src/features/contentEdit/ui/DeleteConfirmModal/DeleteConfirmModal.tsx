import { memo } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import styles from "./DeleteConfirmModal.module.css";

type DeleteConfirmModalProps = {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
};

export const DeleteConfirmModal = memo(function DeleteConfirmModal({
  isDeleting,
  onCancel,
  onConfirm,
  title
}: DeleteConfirmModalProps) {
  return (
    <div className={styles.modalBackdrop} role="presentation">
      <dialog
        aria-labelledby="delete-content-title"
        className={styles.modal}
        open
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="delete-content-title">
            コンテンツを削除
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
        <p className={styles.modalBody}>
          「{title}」を削除します。この操作は取り消せません。
        </p>
        <div className={styles.modalActions}>
          <Button disabled={isDeleting} onClick={onCancel} type="button">
            キャンセル
          </Button>
          <Button
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
            variant="danger"
          >
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </div>
      </dialog>
    </div>
  );
});
