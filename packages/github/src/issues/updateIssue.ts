import type { GitHubIssueUpdateParams } from "../types/github";
import { createGitHubClient } from "../client/createGitHubClient";

export async function updateIssue({
  issueNumber,
  owner,
  repo,
  token,
  input
}: GitHubIssueUpdateParams) {
  const octokit = createGitHubClient(token);
  const response = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    title: input.title,
    body: input.body,
    state: input.state
  });

  return response.data;
}
