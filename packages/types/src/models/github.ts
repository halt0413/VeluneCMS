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

export type GitHubIssue = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  url: string;
  state: "open" | "closed";
  labels: GitHubIssueLabel[];
};

export type GitHubIssueLink = Pick<GitHubIssue, "id" | "number" | "url">;

export type GitHubIssueCreateResult = GitHubIssueLink & {
  title: string;
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
