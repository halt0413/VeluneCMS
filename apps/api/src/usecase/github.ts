import type {
  GitHubIssue,
  GitHubIssueGateway,
  GitHubIssueInput,
  GitHubIssueLabel,
  GitHubIssueUpdateInput
} from "../domain/github";

export function createIssue(
  gitHubIssueGateway: GitHubIssueGateway,
  input: GitHubIssueInput
): Promise<GitHubIssue> {
  return gitHubIssueGateway.createIssue(input);
}

export function getIssue(
  gitHubIssueGateway: GitHubIssueGateway,
  issueNumber: number
): Promise<GitHubIssue> {
  return gitHubIssueGateway.getIssue(issueNumber);
}

export function listIssues(
  gitHubIssueGateway: GitHubIssueGateway
): Promise<GitHubIssue[]> {
  return gitHubIssueGateway.listIssues();
}

export function updateIssue(
  gitHubIssueGateway: GitHubIssueGateway,
  issueNumber: number,
  input: GitHubIssueUpdateInput
): Promise<GitHubIssue> {
  return gitHubIssueGateway.updateIssue(issueNumber, input);
}

export function updateIssueLabels(
  gitHubIssueGateway: GitHubIssueGateway,
  issueNumber: number,
  labels: GitHubIssueLabel[]
): Promise<GitHubIssue> {
  return gitHubIssueGateway.addLabels(issueNumber, labels);
}
