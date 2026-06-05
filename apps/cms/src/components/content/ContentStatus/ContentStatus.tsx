import type { ContentStatus as ContentStatusValue } from "../../../domain/content";
import styles from "./ContentStatus.module.css";

type ContentStatusProps = {
  status: ContentStatusValue;
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
