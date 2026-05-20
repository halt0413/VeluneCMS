export type CmsContentStatus = "draft" | "published";

export type CmsPageUser = {
  id: number;
  login: string;
};

export type CmsPage = {
  body: string;
  contentType: string;
  createdAt: string;
  createdBy?: CmsPageUser;
  id: string;
  publishedAt?: string;
  slug: string;
  status: CmsContentStatus;
  title: string;
  updatedAt: string;
  updatedBy?: CmsPageUser;
};

export type ContentCollection = {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

type CmsPageItemResponse = {
  item: CmsPage;
};

type CmsPageListResponse = {
  items: CmsPage[];
  total: number;
};

type ContentCollectionListResponse = {
  items: ContentCollection[];
  total: number;
};

export type CmsClientConfig = {
  baseUrl: string;
  fetch?: typeof fetch;
};

export type ListContentsOptions = {
  contentType?: string;
  includeDrafts?: boolean;
};

export type GetContentOptions = {
  includeDrafts?: boolean;
};

export class CmsClientError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "CmsClientError";
  }
}

export type CmsClient = {
  getContent(id: string, options?: GetContentOptions): Promise<CmsPage | null>;
  getContentBySlug(
    slug: string,
    options?: ListContentsOptions
  ): Promise<CmsPage | null>;
  listContentCollections(): Promise<ContentCollection[]>;
  listContents(options?: ListContentsOptions): Promise<CmsPage[]>;
};

export function createCmsClient({
  baseUrl,
  fetch: fetcher = fetch
}: CmsClientConfig): CmsClient {
  const apiBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  async function request<T>(path: string): Promise<T> {
    const response = await fetcher(new URL(path, apiBaseUrl), {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new CmsClientError(`CMS request failed: ${response.status}`, response.status);
    }

    return (await response.json()) as T;
  }

  function canReadContent(content: CmsPage, includeDrafts = false): boolean {
    return includeDrafts || content.status === "published";
  }

  return {
    async getContent(id, options = {}) {
      const response = await request<CmsPageItemResponse>(`contents/${id}`);
      return canReadContent(response.item, options.includeDrafts)
        ? response.item
        : null;
    },

    async getContentBySlug(slug, options = {}) {
      const contents = await this.listContents(options);
      return contents.find((content) => content.slug === slug) ?? null;
    },

    async listContentCollections() {
      const response = await request<ContentCollectionListResponse>(
        "content-collections"
      );
      return response.items;
    },

    async listContents(options = {}) {
      const response = await request<CmsPageListResponse>("contents");
      return response.items.filter((content) => {
        if (!canReadContent(content, options.includeDrafts)) {
          return false;
        }

        return options.contentType
          ? content.contentType === options.contentType
          : true;
      });
    }
  };
}
