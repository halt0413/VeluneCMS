import type { AuthUser } from "../../domain";

export type MeResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  loggedOut: true;
};
