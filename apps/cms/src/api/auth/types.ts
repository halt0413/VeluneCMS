export type AuthUser = {
  avatarUrl: string;
  email: string | null;
  id: number;
  login: string;
  name: string | null;
  profileUrl: string;
};

export type MeResponse = {
  user: AuthUser;
};
