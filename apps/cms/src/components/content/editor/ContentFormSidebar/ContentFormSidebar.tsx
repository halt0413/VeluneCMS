import styles from "./ContentFormSidebar.module.css";

type ContentFormSidebarProps = {
  description: string;
  showStatus: boolean;
};

export function ContentFormSidebar({
  description,
  showStatus
}: ContentFormSidebarProps) {
  return (
    <aside className={styles.sideCard}>
      <div className={styles.sideSection}>
        <h3 className={styles.sectionTitle}>フォームの使い方</h3>
        <p className={styles.endpoint}>{description}</p>
      </div>

      <div className={styles.sideSection}>
        <p className={styles.eyebrow}>入力項目</p>
        <ul className={styles.metaList}>
          <li>title: string</li>
          <li>slug: string</li>
          <li>body: string</li>
          <li>type: 任意の文字列</li>
          {showStatus ? <li>status: draft | published</li> : null}
        </ul>
      </div>
    </aside>
  );
}
