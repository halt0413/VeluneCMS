import type { AuthUser, MeResponse } from "./types";
import { getCmsApiBaseUrl } from "../../api/cms/getApiConfig";

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const apiUrl = getCmsApiBaseUrl();
    const response = await fetch(new URL("/me", apiUrl), {
      cache: "no-store",
      credentials: "include"
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as MeResponse;
    return data.user;
  } catch {
    return null;
  }
}
