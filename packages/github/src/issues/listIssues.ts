import type { GitHubIssueListParams } from "../types/github";
import { createGitHubClient } from "../client/createGitHubClient";

export async function listIssues({ owner, repo, token }: GitHubIssueListParams) {
  const octokit = createGitHubClient(token);
  const response = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: "all"
  });

  return response.data.filter((issue) => !("pull_request" in issue));
}
