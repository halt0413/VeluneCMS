import { Link } from "@tanstack/react-router";
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
              <Link
                className={`${styles.link} ${styles.linkActive}`}
                key={collection.id}
                search={{ collection: collection.slug }}
                to="/contents"
              >
                <span className={styles.linkMark} />
                {collection.name}
              </Link>
            ))}
          </div>
        </section>
      </nav>
    </div>
  );
}
