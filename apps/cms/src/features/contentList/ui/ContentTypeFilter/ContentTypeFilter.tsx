import styles from "./ContentTypeFilter.module.css";

type ContentTypeFilterProps = {
  activeValue: string;
  allLabel?: string;
  items: string[];
};

export function ContentTypeFilter({
  activeValue,
  allLabel = "すべて",
  items
}: ContentTypeFilterProps) {
  return (
    <div className={styles.filterRow}>
      <button
        className={
          activeValue === "all"
            ? `${styles.filterButton} ${styles.filterButtonActive}`
            : styles.filterButton
        }
        type="button"
      >
        {allLabel}
      </button>
      {items.map((item) => (
        <button
          className={
            activeValue === item
              ? `${styles.filterButton} ${styles.filterButtonActive}`
              : styles.filterButton
          }
          key={item}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
