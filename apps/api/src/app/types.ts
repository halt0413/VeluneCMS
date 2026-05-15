import type { SessionRepository } from "../usecase/auth";
import type {
  AuthControllerHandlers,
  ContentCollectionsControllerHandlers,
  ContentsControllerHandlers,
  GitHubControllerHandlers,
  MeControllerHandler,
  PreviewControllerHandlers
} from "../presentation/controllers";

export type AppHttpConfig = {
  adminApiToken: string;
  cookieSecure: boolean;
  githubWebhookSecret?: string;
  sessionCookieName: string;
  webOrigin: string;
};

export type AppHttpInfrastructure = {
  sessionRepository: SessionRepository;
};

export type CreateAppDependencies = AppHttpConfig &
  AuthControllerHandlers &
  ContentCollectionsControllerHandlers &
  ContentsControllerHandlers &
  GitHubControllerHandlers &
  PreviewControllerHandlers &
  MeControllerHandler &
  AppHttpInfrastructure;
