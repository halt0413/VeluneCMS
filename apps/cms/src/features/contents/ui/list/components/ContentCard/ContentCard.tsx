import { formatDate } from "@repo/utils";
import { Link } from "@tanstack/react-router";
import { ContentStatus } from "../../../../../../components/content/ContentStatus/ContentStatus";
import type { Content } from "../../../../../../domain/content/content";
import styles from "./ContentCard.module.css";

type ContentCardProps = {
  content: Content;
};

export function ContentCard({ content }: ContentCardProps) {
  return (
    <article className={styles.contentCard}>
      <div className={styles.contentMain}>
        <div className={styles.cardMeta}>
          <ContentStatus status={content.status} />
          <span className={styles.metaDivider}>/</span>
          <span className={styles.typeText}>{content.contentType}</span>
        </div>

        <div className={styles.contentHeading}>
          <Link className={styles.contentTitle} params={{ id: content.id }} to="/contents/$id">
            {content.title}
          </Link>
          <code className={styles.contentSlug}>{content.slug}</code>
        </div>
      </div>

      <div className={styles.contentAside}>
        <time className={styles.contentDate}>{formatDate(content.updatedAt)}</time>
        <div className={styles.actionsGroup}>
          <Link className={styles.inlineLink} params={{ id: content.id }} to="/contents/$id">
            詳細
          </Link>
          <Link
            className={styles.inlineLink}
            params={{ id: content.id }}
            to="/contents/$id/edit"
          >
            編集
          </Link>
        </div>
      </div>
    </article>
  );
}
