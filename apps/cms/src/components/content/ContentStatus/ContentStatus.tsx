import type { CmsContentStatus } from "@repo/types";
import styles from "./ContentStatus.module.css";

type ContentStatusProps = {
  status: CmsContentStatus;
};

export function ContentStatus({ status }: ContentStatusProps) {
  const label = status === "draft" ? "下書き" : "公開中";
  const dotClassName =
    status === "draft"
      ? `${styles.statusDot} ${styles.statusDotDraft}`
      : styles.statusDot;

  return (
    <span className={styles.status}>
      <span className={dotClassName} />
      {label}
    </span>
  );
}
