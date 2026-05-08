export type CmsContentStatus = "draft" | "published";

export type CmsPageId = string;

export type CmsPageInput = {
  slug: string;
  title: string;
  body: string;
  status: CmsContentStatus;
};

export type CmsPagePatch = Partial<CmsPageInput>;

export type CmsPageRecord = CmsPageInput & {
  id: CmsPageId;
  createdAt: string;
  updatedAt: string;
};

export type CmsDraftPage = CmsPageRecord & {
  status: "draft";
  publishedAt?: never;
};

export type CmsPublishedPage = CmsPageRecord & {
  status: "published";
  publishedAt: string;
};

export type CmsPage = CmsDraftPage | CmsPublishedPage;

export type PublicContent = Pick<CmsPageInput, "slug" | "title" | "body">;

export type ContentPreview = PublicContent & {
  mode: "preview";
};

export type PublishedContent = PublicContent &
  Pick<CmsPublishedPage, "publishedAt">;

type PageProps = {
  body: string;
  createdAt: string;
  id: CmsPageId;
  publishedAt?: string;
  slug: string;
  status: CmsContentStatus;
  title: string;
  updatedAt: string;
};

type CreatePageParams = {
  id: CmsPageId;
  input: CmsPageInput;
  now: string;
};

export class Slug {
  private constructor(private readonly value: string) {}

  static create(input: string): Slug {
    const value = input
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^\/+|\/+$/g, "");

    if (!value) {
      throw new Error("Slug is required");
    }

    return new Slug(value);
  }

  toString(): string {
    return this.value;
  }
}

export class Page {
  private constructor(private readonly props: PageProps) {}

  static create({ id, input, now }: CreatePageParams): Page {
    return new Page({
      id,
      slug: Slug.create(input.slug).toString(),
      title: normalizeRequiredText(input.title, "Title"),
      body: normalizeRequiredText(input.body, "Body"),
      status: input.status,
      createdAt: now,
      updatedAt: now,
      publishedAt: input.status === "published" ? now : undefined
    });
  }

  static reconstitute(snapshot: CmsPage): Page {
    return new Page({
      id: snapshot.id,
      slug: Slug.create(snapshot.slug).toString(),
      title: normalizeRequiredText(snapshot.title, "Title"),
      body: normalizeRequiredText(snapshot.body, "Body"),
      status: snapshot.status,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
      publishedAt:
        snapshot.status === "published" ? snapshot.publishedAt : undefined
    });
  }

  get id(): CmsPageId {
    return this.props.id;
  }

  get slug(): string {
    return this.props.slug;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  update(patch: CmsPagePatch, now: string): void {
    if (patch.slug !== undefined) {
      this.props.slug = Slug.create(patch.slug).toString();
    }

    if (patch.title !== undefined) {
      this.props.title = normalizeRequiredText(patch.title, "Title");
    }

    if (patch.body !== undefined) {
      this.props.body = normalizeRequiredText(patch.body, "Body");
    }

    if (patch.status !== undefined) {
      this.changeStatus(patch.status, now);
    }

    this.props.updatedAt = now;
  }

  toSnapshot(): CmsPage {
    const base = {
      id: this.props.id,
      slug: this.props.slug,
      title: this.props.title,
      body: this.props.body,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt
    };

    if (this.props.status === "published") {
      return {
        ...base,
        status: "published",
        publishedAt: this.props.publishedAt ?? this.props.updatedAt
      };
    }

    return {
      ...base,
      status: "draft"
    };
  }

  private changeStatus(status: CmsContentStatus, now: string): void {
    if (status === "published") {
      this.props.status = "published";
      this.props.publishedAt ??= now;
      return;
    }

    this.props.status = "draft";
    this.props.publishedAt = undefined;
  }
}

function normalizeRequiredText(input: string, fieldName: string): string {
  const value = input.trim();

  if (!value) {
    throw new Error(`${fieldName} is required`);
  }

  return value;
}
