import type {
  GitHubIssue,
  GitHubIssueInput,
  GitHubIssueLabel
} from "../models/github";
import type { ApiItemResponse, ApiListResponse } from "./common";

export type IssueCreateRequest = GitHubIssueInput;

export type IssueUpdateRequest = Partial<
  Pick<GitHubIssueInput, "title" | "body">
> & {
  state?: GitHubIssue["state"];
};

export type IssueLabelsUpdateRequest = {
  labels: GitHubIssueLabel[];
};

export type IssuesListResponse = ApiListResponse<GitHubIssue>;

export type IssueItemResponse = ApiItemResponse<GitHubIssue>;

export type IssueCreateResponse = {
  created: GitHubIssue;
};

export type IssueUpdateResponse = {
  updated: GitHubIssue;
};

export type IssueLabelsResponse = {
  updated: GitHubIssue;
};
