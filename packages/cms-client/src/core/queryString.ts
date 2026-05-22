export function createQueryString(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    // undefinedや空文字はAPIへ送らず、未指定filterとして扱う
    if (value) {
      query.set(key, value);
    }
  }

  return query.toString();
}
