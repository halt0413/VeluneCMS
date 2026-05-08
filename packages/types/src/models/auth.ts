export type AuthUser = {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatarUrl: string;
  profileUrl: string;
};
