import type { AuthUser } from "../../../../api/auth/types";
import styles from "./HeaderAuthView.module.css";

type HeaderAuthViewProps = {
  currentUser: AuthUser | null | undefined;
  isLoading: boolean;
  loginHref: string | null;
};

export function HeaderAuthView({
  currentUser,
  isLoading,
  loginHref
}: HeaderAuthViewProps) {
  if (isLoading) {
    return <p className={styles.loginMuted}>読み込み中</p>;
  }

  if (currentUser) {
    return (
      <div className={styles.brandIdentity}>
        <img
          alt={`${currentUser.login} GitHub avatar`}
          className={styles.avatar}
          height="36"
          src={currentUser.avatarUrl}
          width="36"
        />
        <p className={styles.handle}>{currentUser.name ?? currentUser.login}</p>
      </div>
    );
  }

  if (loginHref) {
    return (
      <a className={styles.loginButton} href={loginHref}>
        ログイン
      </a>
    );
  }

  return <p className={styles.loginMuted}>ログイン</p>;
}
