import { cmsPageSchema, toPageContent } from "@repo/content";
import type {
  CmsPageCreateResponse,
  CmsPageDeleteResponse,
  CmsPageItemResponse,
  CmsPageListResponse,
  CmsPageUpdateResponse,
  CmsPreviewResponse
} from "../contracts";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { NotFoundError } from "../../lib/errors/AppError";
import { requireRouteParam } from "../params";
import type { ContentsControllerHandlers } from "../types";

const cmsPagePatchSchema = cmsPageSchema.partial();

export function createContentsController({
  createContent,
  deleteContent,
  getCurrentUser,
  getContent,
  getContentPreviewById,
  listContents,
  sessionCookieName,
  updateContent
}: ContentsControllerHandlers & { sessionCookieName: string }) {
  return {
    async list(c: Context) {
      const contentType = c.req.query("contentType");
      const sessionId = getCookie(c, sessionCookieName);
      const currentUser = sessionId ? getCurrentUser(sessionId) : undefined;
      const items = (await listContents()).filter((content) => {
        if (contentType && content.contentType !== contentType) {
          return false;
        }

        // ログインユーザーの存在しないコンテンツとして返し、他ユーザーのID推測を防ぐ
        if (currentUser && content.owner?.id !== currentUser.id) {
          return false;
        }

        return true;
      });
      const response: CmsPageListResponse = {
        items,
        total: items.length
      };

      return c.json(response);
    },
    async get(c: Context) {
      const sessionId = getCookie(c, sessionCookieName);
      const currentUser = sessionId ? getCurrentUser(sessionId) : undefined;
      const item = await getContent(requireRouteParam(c, "id"));

      // 権限エラーではなくNotFoundにして、コンテンツの存在自体を漏らさない
      if (currentUser && item.owner?.id !== currentUser.id) {
        throw new NotFoundError("Page not found");
      }

      const response: CmsPageItemResponse = {
        item
      };

      return c.json(response);
    },
    async create(c: Context) {
      const payload = await c.req.json();
      const sessionId = getCookie(c, sessionCookieName);
      const created = await createContent(
        cmsPageSchema.parse(payload),
        sessionId ? getCurrentUser(sessionId) : undefined
      );
      const response: CmsPageCreateResponse = {
        created
      };

      return c.json(response, 201);
    },
    async update(c: Context) {
      const payload = await c.req.json();
      const sessionId = getCookie(c, sessionCookieName);
      const updated = await updateContent(
        requireRouteParam(c, "id"),
        cmsPagePatchSchema.parse(payload),
        sessionId ? getCurrentUser(sessionId) : undefined
      );
      const response: CmsPageUpdateResponse = {
        updated
      };

      return c.json(response);
    },
    async remove(c: Context) {
      const sessionId = getCookie(c, sessionCookieName);
      const response: CmsPageDeleteResponse = await deleteContent(
        requireRouteParam(c, "id"),
        sessionId ? getCurrentUser(sessionId) : undefined
      );

      return c.json(response);
    },
    async preview(c: Context) {
      const page = await getContentPreviewById(requireRouteParam(c, "id"));
      const response: CmsPreviewResponse = {
        slug: page.slug,
        status: "preview",
        content: toPageContent(page)
      };

      return c.json(response);
    }
  };
}
