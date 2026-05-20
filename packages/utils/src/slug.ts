export function normalizeSlug(input: string): string {
  return input
    .trim()
    .replaceAll(/[\s_]+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^\/+|\/+$/g, "");
}
