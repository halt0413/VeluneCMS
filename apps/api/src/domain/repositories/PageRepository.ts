import type { Page } from "../entities/Page";
import type { CmsPageId } from "../types/page";

// RepositoryInterface Pageの保存・取得方法だけを決める
// Pageの保存先はここでは決めない DB実装はinfrastructure側
export interface PageRepository {
  delete(id: CmsPageId): Promise<void>;
  findById(id: CmsPageId): Promise<Page | undefined>;
  findBySlug(slug: string): Promise<Page | undefined>;
  list(): Promise<Page[]>;
  save(page: Page): Promise<Page>;
}
