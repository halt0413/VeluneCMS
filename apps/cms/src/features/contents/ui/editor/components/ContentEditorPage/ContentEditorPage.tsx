import type { ReactNode } from "react";
import { PageHeader } from "../../../../../../components/content/PageHeader/PageHeader";
import styles from "./ContentEditorPage.module.css";

type ContentEditorPageProps = {
  children: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
};

export function ContentEditorPage({
  children,
  subtitle,
  title
}: ContentEditorPageProps) {
  return (
    <main className={styles.page}>
      <PageHeader subtitle={subtitle} title={title} />
      {children}
    </main>
  );
}
