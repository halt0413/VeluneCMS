import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { ContentCollection } from "../../../domain/contentCollection";
import { useContentCollectionsQuery } from "../../../features/contentCollectionList/hooks/useContentCollectionsQuery";
import { HeaderAuth } from "./HeaderAuth/HeaderAuth";
import styles from "./Header.module.css";

export function Header() {
  const { data: collections = [] } = useContentCollectionsQuery();

  return (
    <div className={styles.sidebar}>
      <header className={styles.brand}>
        <HeaderAuth />
      </header>

      <nav className={styles.nav}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>コンテンツ</p>
            <Link
              aria-label="コンテンツ種別を追加"
              className={styles.addButton}
              to="/content-collections/new"
            >
              ＋
            </Link>
          </div>
          <div className={styles.stack}>
            {collections.map((collection) => (
              <ContentCollectionLink
                collection={collection}
                key={collection.id}
              />
            ))}
          </div>
        </section>
      </nav>
    </div>
  );
}

type ContentCollectionLinkProps = {
  collection: ContentCollection;
};

function ContentCollectionLink({ collection }: ContentCollectionLinkProps) {
  const search = useMemo(
    () => ({
      collection: collection.slug,
    }),
    [collection.slug],
  );
  const editParams = useMemo(
    () => ({
      id: collection.id
    }),
    [collection.id]
  );

  return (
    <div className={styles.collectionRow}>
      <Link
        className={`${styles.link} ${styles.linkActive}`}
        search={search}
        to="/contents"
      >
        <span className={styles.linkMark} />
        {collection.name}
      </Link>
      <Link
        className={styles.editLink}
        params={editParams}
        to="/content-collections/$id/edit"
      >
        編集
      </Link>
    </div>
  );
}
