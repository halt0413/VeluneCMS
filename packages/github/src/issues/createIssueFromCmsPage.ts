import { createIssue } from "./createIssue";
import { toGitHubIssueInput } from "./toGitHubIssueInput";
import type { CmsPageIssueInput } from "./types";
import type { GitHubRepoRef } from "../types/github";

type CreateIssueFromCmsPageParams = GitHubRepoRef & {
  token: string;
  page: CmsPageIssueInput;
};

export async function createIssueFromCmsPage({
  owner,
  repo,
  token,
  page
}: CreateIssueFromCmsPageParams) {
  return createIssue({
    owner,
    repo,
    token,
    input: toGitHubIssueInput(page)
  });
}
