import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "../../../../components/content/PageHeader/PageHeader";
import { getButtonClassName } from "../../../../components/ui/Button/Button";
import type { Content } from "../../../../domain/content/content";
import { ContentCard } from "../ContentCard/ContentCard";
import { ContentTypeFilter } from "../ContentTypeFilter/ContentTypeFilter";
import styles from "./ContentsPage.module.css";

type ContentsPageProps = {
  collectionName: string;
  collectionSlug: string;
  contents: Content[];
};

export function ContentsPage({
  collectionName,
  collectionSlug,
  contents
}: ContentsPageProps) {
  const contentTypes = useMemo(
    () => Array.from(new Set(contents.map((content) => content.contentType))),
    [contents]
  );
  const newContentSearch = useMemo(
    () => ({
      collection: collectionSlug
    }),
    [collectionSlug]
  );

  return (
    <main className={styles.page}>
      <PageHeader
        actions={
          <Link
            className={getButtonClassName("primary")}
            search={newContentSearch}
            to="/contents/new"
          >
            追加
          </Link>
        }
        actionsClassName={styles.toolbar}
        title="コンテンツ一覧"
      />

      <section className={`${styles.panel} ${styles.listPanel}`}>
        <div className={styles.collectionHeader}>
          <div className={styles.collectionIntro}>
            <h3 className={styles.collectionName}>{collectionName}</h3>
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
