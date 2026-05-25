import type { CmsPage } from "./types.js";

type RequiredReadContentOptions = {
  includeDrafts: boolean;
};

export function canReadContent(
  content: CmsPage,
  { includeDrafts }: RequiredReadContentOptions
): boolean {
  if (!includeDrafts && content.status !== "published") {
    return false;
  }

  return true;
}

export function filterContents(
  contents: CmsPage[],
  {
    contentType,
    includeDrafts
  }: {
    contentType?: string;
    includeDrafts: boolean;
  }
): CmsPage[] {
  return contents.filter((content) => {
    if (!canReadContent(content, { includeDrafts })) {
      return false;
    }

    return contentType ? content.contentType === contentType : true;
  });
}
