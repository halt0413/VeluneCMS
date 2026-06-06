import type { SessionRepository } from "../usecase/auth";
import type {
  AuthControllerHandlers,
  ContentCollectionsControllerHandlers,
  ContentsControllerHandlers,
  MeControllerHandler,
  PreviewControllerHandlers
} from "../presentation/controllers";

export type AppHttpConfig = {
  adminApiToken: string;
  cookieSecure: boolean;
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
  PreviewControllerHandlers &
  MeControllerHandler &
  AppHttpInfrastructure;
