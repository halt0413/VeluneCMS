export function createApiUrl(apiUrl: string, path: string): URL {
  const normalizedBase = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBase);
}
