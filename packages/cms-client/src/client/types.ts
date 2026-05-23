import type {
  ContentCollection,
  CmsPage,
  GetContentOptions,
  ListContentsOptions
} from "../content/types.js";

export type { GetContentOptions, ListContentsOptions };

export type VeluneClientConfig = {
  contentPath?: string;
  defaultIncludeDrafts?: boolean;
};

export type StaticVeluneClient = {
  getContent(id: string, options?: GetContentOptions): Promise<CmsPage>;
  getContentBySlug(
    slug: string,
    options?: ListContentsOptions
  ): Promise<CmsPage>;
  listContentCollections(): Promise<ContentCollection[]>;
  listContents(options?: ListContentsOptions): Promise<CmsPage[]>;
};
