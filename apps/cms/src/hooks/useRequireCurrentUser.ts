import { useEffect } from "react";
import { getLoginHref } from "../api/auth/getLoginHref";
import { useCurrentUserQuery } from "./useCurrentUserQuery";

export function useRequireCurrentUser(redirectTo: string) {
  const currentUserQuery = useCurrentUserQuery();
  const loginHref = getLoginHref(redirectTo);

  useEffect(() => {
    // 未ログイン時だけGitHub OAuthへ送る 確認中にredirectするとログイン済みユーザーも弾いてしまう
    if (currentUserQuery.isPending || currentUserQuery.data || !loginHref) {
      return;
    }

    window.location.assign(loginHref);
  }, [currentUserQuery.data, currentUserQuery.isPending, loginHref]);

  return {
    currentUser: currentUserQuery.data,
    isCheckingAuth: currentUserQuery.isPending || !currentUserQuery.data
  };
}
