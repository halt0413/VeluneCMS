import type { AuthUser } from "../models/auth";

export type MeResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  loggedOut: true;
};
