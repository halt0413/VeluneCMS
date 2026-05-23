import type { GitHubIssueLabelsUpdateParams } from "../types/github";
import { createGitHubClient } from "../client/createGitHubClient";

export async function updateIssueLabels({
  issueNumber,
  labels,
  owner,
  repo,
  token
}: GitHubIssueLabelsUpdateParams) {
  const octokit = createGitHubClient(token);
  const response = await octokit.rest.issues.setLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels
  });

  return response.data;
}
