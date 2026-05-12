import type {
  CmsContentStatus,
  CmsPage,
  CmsPageId,
  CmsPageInput,
  CmsPagePatch
} from "../types/page";
import { Slug } from "../valueObjects/Slug";

// DomainEntity ページとして守るルールを持つ
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

// ページの入力チェックと公開状態の扱いはここで見る
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

  // 保存済みのデータもそのまま信用せずPageとして組み直す
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

  // publishedAtは初回公開時だけ 下書きに戻したら消す
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
