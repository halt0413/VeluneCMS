import type {
  ContentCollectionInput,
  ContentCollectionPatch,
  ContentCollectionSnapshot
} from "../types/contentCollection";
import { Slug } from "../valueObjects/Slug";

type ContentCollectionProps = ContentCollectionSnapshot;

type CreateContentCollectionParams = {
  id: string;
  input: ContentCollectionInput;
  now: string;
};

export class ContentCollection {
  private constructor(private readonly props: ContentCollectionProps) {}

  static create({ id, input, now }: CreateContentCollectionParams) {
    return new ContentCollection({
      id,
      name: normalizeRequiredText(input.name, "Name"),
      slug: Slug.create(input.slug).toString(),
      createdAt: now,
      updatedAt: now
    });
  }

  static reconstitute(snapshot: ContentCollectionSnapshot) {
    return new ContentCollection({
      id: snapshot.id,
      name: normalizeRequiredText(snapshot.name, "Name"),
      slug: Slug.create(snapshot.slug).toString(),
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt
    });
  }

  get id() {
    return this.props.id;
  }

  get slug() {
    return this.props.slug;
  }

  update(patch: ContentCollectionPatch, now: string): void {
    if (patch.name !== undefined) {
      this.props.name = normalizeRequiredText(patch.name, "Name");
    }

    if (patch.slug !== undefined) {
      this.props.slug = Slug.create(patch.slug).toString();
    }

    this.props.updatedAt = now;
  }

  toSnapshot(): ContentCollectionSnapshot {
    return { ...this.props };
  }
}

function normalizeRequiredText(input: string, fieldName: string): string {
  const value = input.trim();

  if (!value) {
    throw new Error(`${fieldName} is required`);
  }

  return value;
}
