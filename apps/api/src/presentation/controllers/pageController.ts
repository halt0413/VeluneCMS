import { cmsPageSchema, toPageContent } from "@repo/content";
import type {
  CmsPageCreateResponse,
  CmsPageItemResponse,
  CmsPageListResponse,
  CmsPreviewResponse
} from "../contracts";
import type { Context } from "hono";
import { BadRequestError } from "../../lib/errors/AppError";
import { requireRouteParam } from "../params";
import type {
  PagesControllerHandlers,
  PreviewControllerHandlers
} from "../types";

export function createPagesController({
  createPage,
  getPage,
  getPagePreviewById,
  listPages
}: PagesControllerHandlers) {
  return {
    async list(c: Context) {
      const items = await listPages();
      const response: CmsPageListResponse = {
        items,
        total: items.length
      };

      return c.json(response);
    },
    async get(c: Context) {
      const page = await getPage(requireRouteParam(c, "id"));
      const response: CmsPageItemResponse = {
        item: page
      };

      return c.json(response);
    },
    async create(c: Context) {
      const payload = await c.req.json();
      const created = await createPage(cmsPageSchema.parse(payload));
      const response: CmsPageCreateResponse = {
        created
      };

      return c.json(response, 201);
    },
    async preview(c: Context) {
      const page = await getPagePreviewById(requireRouteParam(c, "id"));
      const response: CmsPreviewResponse = {
        slug: page.slug,
        status: "preview",
        content: toPageContent(page)
      };

      return c.json(response);
    },
  };
}

export function createPreviewController({
  getPagePreviewBySlug
}: PreviewControllerHandlers) {
  return {
    async get(c: Context) {
      const slug = c.req.param("slug");

      if (!slug) {
        throw new BadRequestError("slug is required");
      }

      const page = await getPagePreviewBySlug(slug);
      const response: CmsPreviewResponse = {
        slug: page.slug,
        status: "preview",
        content: toPageContent(page)
      };

      return c.json(response);
    }
  };
}
