import { normalizeSlug } from "@repo/utils";
import type { CmsPageIssueInput } from "./types";
import type { GitHubIssueInput } from "../types/github";

export function toGitHubIssueInput(input: CmsPageIssueInput): GitHubIssueInput {
  const slug = normalizeSlug(input.slug);
  const title = input.title.trim();
  const labels = ["cms", input.status];
  const body = [
    `slug: ${slug}`,
    `status: ${input.status}`,
    "",
    input.body.trim()
  ].join("\n");

  return {
    title: `[CMS] ${title}`,
    body,
    labels
  };
}
