import type {
  CmsContentStatus,
  CmsPage,
  CmsPageId,
  CmsPageInput,
  CmsPagePatch,
  CmsPageUser
} from "../types/page";
import { Slug } from "../valueObjects/Slug";

// PageはDB行ではなくドメイン上のコンテンツ　slug/status/ownerなどの不変条件をここに集める
type PageProps = {
  body: string;
  contentType: string;
  createdBy?: CmsPageUser;
  createdAt: string;
  id: CmsPageId;
  owner?: CmsPageUser;
  publishedAt?: string;
  slug: string;
  status: CmsContentStatus;
  title: string;
  updatedBy?: CmsPageUser;
  updatedAt: string;
};

type CreatePageParams = {
  actor?: CmsPageUser;
  id: CmsPageId;
  input: CmsPageInput;
  now: string;
};

export class Page {
  private constructor(private readonly props: PageProps) {}

  static create({ actor, id, input, now }: CreatePageParams): Page {
    return new Page({
      id,
      slug: Slug.create(input.slug).toString(),
      title: normalizeRequiredText(input.title, "Title"),
      body: normalizeRequiredText(input.body, "Body"),
      contentType: normalizeRequiredText(input.contentType, "Content type"),
      createdBy: actor,
      // ownerは「このコンテンツの所属ユーザー」 更新者とは違い、編集では変更しない
      owner: actor,
      status: input.status,
      updatedBy: actor,
      createdAt: now,
      updatedAt: now,
      publishedAt: input.status === "published" ? now : undefined
    });
  }

  // 保存済みのデータもそのまま信用せず、slug正規化やstatus整合性を通してから復元する
  static reconstitute(snapshot: CmsPage): Page {
    return new Page({
      id: snapshot.id,
      slug: Slug.create(snapshot.slug).toString(),
      title: normalizeRequiredText(snapshot.title, "Title"),
      body: normalizeRequiredText(snapshot.body, "Body"),
      contentType: normalizeRequiredText(snapshot.contentType, "Content type"),
      createdBy: snapshot.createdBy,
      owner: snapshot.owner,
      status: snapshot.status,
      updatedBy: snapshot.updatedBy,
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

  update(patch: CmsPagePatch, now: string, actor?: CmsPageUser): void {
    if (patch.slug !== undefined) {
      this.props.slug = Slug.create(patch.slug).toString();
    }

    if (patch.title !== undefined) {
      this.props.title = normalizeRequiredText(patch.title, "Title");
    }

    if (patch.body !== undefined) {
      this.props.body = normalizeRequiredText(patch.body, "Body");
    }

    if (patch.contentType !== undefined) {
      this.props.contentType = normalizeRequiredText(
        patch.contentType,
        "Content type"
      );
    }

    if (patch.status !== undefined) {
      this.changeStatus(patch.status, now);
    }

    this.props.updatedBy = actor ?? this.props.updatedBy;
    this.props.updatedAt = now;
  }

  toSnapshot(): CmsPage {
    const base = {
      id: this.props.id,
      slug: this.props.slug,
      title: this.props.title,
      body: this.props.body,
      contentType: this.props.contentType,
      createdBy: this.props.createdBy,
      createdAt: this.props.createdAt,
      updatedBy: this.props.updatedBy,
      owner: this.props.owner,
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

  // publishedAtは初回公開時だけ入れる 下書きに戻した場合は公開状態ではないので消す
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
