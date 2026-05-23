import { createGitHubClient } from "../client/createGitHubClient";
import type { GitHubIssueCreateParams } from "../types/github";

export async function createIssue({
  owner,
  repo,
  token,
  input
}: GitHubIssueCreateParams) {
  const octokit = createGitHubClient(token);

  const response = await octokit.rest.issues.create({
    owner,
    repo,
    title: input.title,
    body: input.body,
    labels: input.labels
  });

  return response.data;
}
