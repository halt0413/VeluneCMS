import type { ReactNode } from "react";
import styles from "./ContentInfoRow.module.css";

type ContentInfoRowProps = {
  children: ReactNode;
  label: ReactNode;
};

export function ContentInfoRow({ children, label }: ContentInfoRowProps) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      {children}
    </div>
  );
}
