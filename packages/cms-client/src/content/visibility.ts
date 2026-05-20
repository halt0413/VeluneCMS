import type { CmsPage } from "./types.js";

type ReadContentOptions = {
  includeDrafts: boolean;
};

export function canReadContent(
  content: CmsPage,
  { includeDrafts }: ReadContentOptions
): boolean {
  // ログインユーザーの絞り込みはAPI側で行い、SDK側ではdraftの可視性だけを守る
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
