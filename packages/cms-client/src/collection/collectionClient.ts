import type { CmsHttpClient } from "../core/httpClient.js";
import type {
  CollectionClient,
  ContentCollection,
  ContentCollectionListResponse
} from "./types.js";

type CreateCollectionClientInput = {
  http: CmsHttpClient;
};

export function createCollectionClient({
  http
}: CreateCollectionClientInput): CollectionClient {
  async function listContentCollections(): Promise<ContentCollection[]> {
    // SDK利用側にはHTTP response wrapperを見せず、resource配列だけ返す
    const response = await http.get<ContentCollectionListResponse>(
      "content-collections"
    );
    return response.items;
  }

  return {
    listContentCollections
  };
}
