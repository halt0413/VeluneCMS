// DomainService 単独のEntityに入れにくいルールを置く
// Entityに入れるほどでもない認証ルールはここ
export function isOAuthStateExpired(
  createdAt: string,
  now: string,
  ttlSeconds: number
): boolean {
  const createdTime = new Date(createdAt).getTime();
  const nowTime = new Date(now).getTime();

  return nowTime - createdTime > ttlSeconds * 1000;
}

export function resolveAuthRedirectUrl(
  cmsUrl: string,
  redirectTo: string | undefined
): string {
  if (!redirectTo) {
    return cmsUrl;
  }

  return new URL(redirectTo, cmsUrl).toString();
}
