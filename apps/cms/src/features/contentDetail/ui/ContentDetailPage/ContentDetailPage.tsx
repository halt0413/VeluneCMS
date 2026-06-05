import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "../../../../components/content/PageHeader/PageHeader";
import type { Content } from "../../../../domain/content";
import { ContentBodyCard } from "../ContentBodyCard/ContentBodyCard";
import { ContentMetaCard } from "../ContentMetaCard/ContentMetaCard";
import styles from "./ContentDetailPage.module.css";

type ContentDetailPageProps = {
  content: Content | null;
};

export function ContentDetailPage({
  content
}: ContentDetailPageProps) {
  const editParams = useMemo(
    () => ({
      id: content?.id ?? ""
    }),
    [content?.id]
  );

  if (!content) {
    return (
      <main className={styles.page}>
        <PageHeader title="コンテンツが見つかりません" />
        <section className={styles.detailGrid}>
          <article className={styles.detailCard}>
            <p>指定したコンテンツは存在しません。</p>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <PageHeader
        actions={
          <Link
            className={styles.ghostButton}
            params={editParams}
            to="/contents/$id/edit"
          >
            編集する
          </Link>
        }
        title={content.title}
      />

      <section className={styles.detailGrid}>
        <ContentMetaCard content={content} />
        <ContentBodyCard content={content} />
      </section>
    </main>
  );
}
