import type { AuthUser } from "../../domain";
import type {
  GitHubOAuthAuthorizeInput,
  GitHubOAuthGateway
} from "../../usecase/auth";
import {
  BadGatewayError,
  ConfigurationError,
  UnauthorizedError
} from "../../lib/errors/AppError";

type GitHubOAuthApiConfig = {
  accessTokenUrl?: string;
  authorizeUrl?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scope?: string;
  userUrl?: string;
};

type GitHubAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GitHubUserResponse = {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
};

export class GitHubOAuthApi implements GitHubOAuthGateway {
  constructor(private readonly config: GitHubOAuthApiConfig) {}

  createAuthorizationUrl({ state }: GitHubOAuthAuthorizeInput): string {
    const authorizeUrl = this.require(
      "GITHUB_OAUTH_AUTHORIZE_URL",
      this.config.authorizeUrl
    );
    const clientId = this.require("GITHUB_OAUTH_CLIENT_ID", this.config.clientId);
    const redirectUri = this.require(
      "GITHUB_OAUTH_REDIRECT_URI",
      this.config.redirectUri
    );
    const scope = this.require("GITHUB_OAUTH_SCOPE", this.config.scope);

    const url = new URL(authorizeUrl);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", scope);
    url.searchParams.set("state", state);

    return url.toString();
  }

  async exchangeCodeForAccessToken(code: string): Promise<string> {
    const accessTokenUrl = this.require(
      "GITHUB_OAUTH_ACCESS_TOKEN_URL",
      this.config.accessTokenUrl
    );
    const clientId = this.require("GITHUB_OAUTH_CLIENT_ID", this.config.clientId);
    const clientSecret = this.require(
      "GITHUB_OAUTH_CLIENT_SECRET",
      this.config.clientSecret
    );
    const redirectUri = this.require(
      "GITHUB_OAUTH_REDIRECT_URI",
      this.config.redirectUri
    );

    const response = await fetch(accessTokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "VeluneCMS"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      throw new BadGatewayError("Failed to exchange GitHub OAuth code");
    }

    const data = (await response.json()) as GitHubAccessTokenResponse;

    if (!data.access_token) {
      throw new UnauthorizedError(
        data.error_description ?? data.error ?? "GitHub OAuth token exchange failed"
      );
    }

    return data.access_token;
  }

  async getUser(accessToken: string): Promise<AuthUser> {
    const userUrl = this.require("GITHUB_OAUTH_USER_URL", this.config.userUrl);
    const response = await fetch(userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "VeluneCMS",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    if (!response.ok) {
      throw new BadGatewayError(
        `Failed to fetch GitHub user: ${response.status} ${await response.text()}`
      );
    }

    const data = (await response.json()) as GitHubUserResponse;

    return {
      id: data.id,
      login: data.login,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
      profileUrl: data.html_url
    };
  }

  private require(name: string, value?: string): string {
    if (!value) {
      throw new ConfigurationError(`${name} is required`);
    }

    return value;
  }
}
