import { Link } from "@tanstack/react-router";
import { PageHeader } from "../../../../../../components/content/PageHeader/PageHeader";
import type { Content } from "../../../../../../domain/content/content";
import { ContentCard } from "../ContentCard/ContentCard";
import { ContentTypeFilter } from "../ContentTypeFilter/ContentTypeFilter";
import styles from "./ContentsPage.module.css";

type ContentsPageProps = {
  contents: Content[];
};

export function ContentsPage({ contents }: ContentsPageProps) {
  const contentTypes = Array.from(
    new Set(contents.map((content) => content.contentType))
  );

  return (
    <main className={styles.page}>
      <PageHeader
        actions={
          <Link className={styles.primaryButton} to="/contents/new">
            新規作成
          </Link>
        }
        actionsClassName={styles.toolbar}
        title="コンテンツ一覧"
      />

      <section className={`${styles.panel} ${styles.listPanel}`}>
        <div className={styles.collectionHeader}>
          <div className={styles.collectionIntro}>
            <h3 className={styles.collectionName}>portfolio</h3>
          </div>
        </div>

        <ContentTypeFilter activeValue="all" items={contentTypes} />

        <div className={styles.contentList}>
          {contents.map((content) => (
            <ContentCard content={content} key={content.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
