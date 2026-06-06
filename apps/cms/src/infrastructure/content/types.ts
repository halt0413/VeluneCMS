import type { z } from "zod";
import type {
  cmsContentStatusSchema,
  cmsPageCreateResponseSchema,
  cmsPageDeleteResponseSchema,
  cmsPageInputSchema,
  cmsPageItemResponseSchema,
  cmsPageListResponseSchema,
  cmsPagePatchSchema,
  cmsPageResourceSchema,
  cmsPageUpdateResponseSchema,
  cmsPageUserSchema
} from "./schema";

export type CmsContentStatus = z.infer<typeof cmsContentStatusSchema>;
export type CmsPageUser = z.infer<typeof cmsPageUserSchema>;
export type CmsPageInput = z.infer<typeof cmsPageInputSchema>;
export type CmsPagePatch = z.infer<typeof cmsPagePatchSchema>;
export type CmsPageResource = z.infer<typeof cmsPageResourceSchema>;
export type CmsPageCreateRequest = CmsPageInput;
export type CmsPageCreateResponse = z.infer<typeof cmsPageCreateResponseSchema>;
export type CmsPageUpdateRequest = CmsPagePatch;
export type CmsPageUpdateResponse = z.infer<typeof cmsPageUpdateResponseSchema>;
export type CmsPageDeleteResponse = z.infer<typeof cmsPageDeleteResponseSchema>;
export type CmsPageItemResponse = z.infer<typeof cmsPageItemResponseSchema>;
export type CmsPageListResponse = z.infer<typeof cmsPageListResponseSchema>;
