export type GitHubRepoRef = {
  owner: string;
  repo: string;
};

export type GitHubIssueLabel = string;

export type GitHubIssueInput = {
  title: string;
  body: string;
  labels?: GitHubIssueLabel[];
};

export type GitHubIssueUpdateInput = Partial<
  Pick<GitHubIssueInput, "title" | "body">
> & {
  state?: "open" | "closed";
};

export type GitHubIssueCreateParams = GitHubRepoRef & {
  token: string;
  input: GitHubIssueInput;
};

export type GitHubIssueGetParams = GitHubRepoRef & {
  token: string;
  issueNumber: number;
};

export type GitHubIssueListParams = GitHubRepoRef & {
  token: string;
};

export type GitHubIssueUpdateParams = GitHubRepoRef & {
  token: string;
  issueNumber: number;
  input: GitHubIssueUpdateInput;
};

export type GitHubIssueLabelsUpdateParams = GitHubRepoRef & {
  token: string;
  issueNumber: number;
  labels: GitHubIssueLabel[];
};

export type RepoRef = GitHubRepoRef;
export type IssueInput = GitHubIssueInput;
