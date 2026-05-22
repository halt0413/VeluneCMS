type CmsApiConfig = {
  baseUrl: string;
};

export function getCmsApiBaseUrl(): string {
  // Vite側の設定名を優先し、既存のAPI_URLも移行期間のfallbackとして許可する
  const baseUrl = import.meta.env.CMS_API_BASE_URL ?? import.meta.env.API_URL;

  if (!baseUrl) {
    throw new Error("CMS_API_BASE_URL or API_URL is required");
  }

  return baseUrl;
}

export function getApiConfig(): CmsApiConfig {
  return { baseUrl: getCmsApiBaseUrl() };
}
