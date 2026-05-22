import type { CmsHttpClient } from "../core/httpClient.js";
import { createQueryString } from "../core/queryString.js";
import type {
  CmsPage,
  CmsPageItemResponse,
  CmsPageListResponse,
  ContentClient,
  GetContentOptions,
  ListContentsOptions
} from "./types.js";
import { canReadContent, filterContents } from "./visibility.js";

type CreateContentClientInput = {
  defaultIncludeDrafts: boolean;
  http: CmsHttpClient;
};

export function createContentClient({
  defaultIncludeDrafts,
  http
}: CreateContentClientInput): ContentClient {
  function shouldIncludeDrafts(
    options: GetContentOptions | ListContentsOptions = {}
  ): boolean {
    return options.includeDrafts ?? defaultIncludeDrafts;
  }

  async function listContents(
    options: ListContentsOptions = {}
  ): Promise<CmsPage[]> {
    const response = await http.get<CmsPageListResponse>(
      getContentListPath({
        contentType: options.contentType
      })
    );

    return filterContents(response.items, {
      contentType: options.contentType,
      includeDrafts: shouldIncludeDrafts(options)
    });
  }

  async function getContent(
    id: string,
    options: GetContentOptions = {}
  ): Promise<CmsPage | null> {
    const response = await http.get<CmsPageItemResponse>(
      `contents/${encodeURIComponent(id)}`
    );

    return canReadContent(response.item, {
      includeDrafts: shouldIncludeDrafts(options)
    })
      ? response.item
      : null;
  }

  async function getContentBySlug(
    slug: string,
    options: ListContentsOptions = {}
  ): Promise<CmsPage | null> {
    // APIのslug取得endpointを公開するまでは、owner/session filter済みの一覧からSDK側で解決する
    const contents = await listContents(options);
    return contents.find((content) => content.slug === slug) ?? null;
  }

  return {
    getContent,
    getContentBySlug,
    listContents
  };
}

function getContentListPath({
  contentType
}: {
  contentType?: string;
}): string {
  const query = createQueryString({
    contentType
  });

  return query ? `contents?${query}` : "contents";
}
