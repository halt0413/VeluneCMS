import type { Content } from "../../../../../../domain/content/content";
import styles from "./ContentBodyCard.module.css";

type ContentBodyCardProps = {
  content: Content;
};

export function ContentBodyCard({ content }: ContentBodyCardProps) {
  return (
    <article className={styles.detailCard}>
      <p className={styles.eyebrow}>本文</p>
      <h3 className={styles.sectionTitle}>content.body</h3>
      <p className={styles.longText}>
        {content.body || "本文はまだ入力されていません。"}
      </p>
    </article>
  );
}
