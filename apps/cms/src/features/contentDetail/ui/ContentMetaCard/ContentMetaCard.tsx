import { formatDate } from "@repo/utils";
import { ContentStatus } from "../../../../components/content/ContentStatus/ContentStatus";
import type { Content } from "../../../../domain/content";
import { ContentInfoRow } from "../ContentInfoRow/ContentInfoRow";
import styles from "./ContentMetaCard.module.css";

type ContentMetaCardProps = {
  content: Content;
};

export function ContentMetaCard({ content }: ContentMetaCardProps) {
  const publishedAt =
    content.status === "published" ? formatDate(content.publishedAt) : null;

  return (
    <article className={styles.detailCard}>
      <ContentInfoRow label="ID">
        <code>{content.id}</code>
      </ContentInfoRow>
      <ContentInfoRow label="slug">
        <code>{content.slug}</code>
      </ContentInfoRow>
      <ContentInfoRow label="種別">
        <span className={styles.typeBadge}>{content.contentType}</span>
      </ContentInfoRow>
      <ContentInfoRow label="status">
        <ContentStatus status={content.status} />
      </ContentInfoRow>
      {content.owner ? (
        <ContentInfoRow label="owner">
          <span>{content.owner.login}</span>
        </ContentInfoRow>
      ) : null}
      <ContentInfoRow label="createdAt">
        <span>{formatDate(content.createdAt)}</span>
      </ContentInfoRow>
      {content.createdBy ? (
        <ContentInfoRow label="createdBy">
          <span>{content.createdBy.login}</span>
        </ContentInfoRow>
      ) : null}
      <ContentInfoRow label="updatedAt">
        <span>{formatDate(content.updatedAt)}</span>
      </ContentInfoRow>
      {content.updatedBy ? (
        <ContentInfoRow label="updatedBy">
          <span>{content.updatedBy.login}</span>
        </ContentInfoRow>
      ) : null}
      {publishedAt ? (
        <ContentInfoRow label="publishedAt">
          <span>{publishedAt}</span>
        </ContentInfoRow>
      ) : null}
    </article>
  );
}
