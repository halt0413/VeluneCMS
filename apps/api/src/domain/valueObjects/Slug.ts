// ValueObject Slugという値自体のルールを持つ
// Slugはここを通してから使う 空文字は不可
export class Slug {
  private constructor(private readonly value: string) {}

  static create(input: string): Slug {
    const value = input
      .trim()
      .replaceAll(/[\s_]+/g, "-")
      .replaceAll(/-+/g, "-")
      .replaceAll(/^\/+|\/+$/g, "");

    if (!value) {
      throw new Error("Slug is required");
    }

    return new Slug(value);
  }

  toString(): string {
    return this.value;
  }
}
