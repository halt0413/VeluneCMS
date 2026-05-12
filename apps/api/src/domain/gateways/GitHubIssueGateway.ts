import type { CmsPage } from "../types/page";
import type {
  GitHubIssue,
  GitHubIssueCreateResult,
  GitHubIssueInput,
  GitHubIssueLabel,
  GitHubIssueUpdateInput
} from "../types/github";

// GatewayInterface 外部サービスとのつなぎ方だけを決める
// GitHubとのつなぎ口 Octokitの都合はここに持ち込まない
export type GitHubIssueGateway = {
  addLabels(
    issueNumber: number,
    labels: GitHubIssueLabel[]
  ): Promise<GitHubIssue>;
  createFromPage(page: CmsPage): Promise<GitHubIssueCreateResult>;
  createIssue(input: GitHubIssueInput): Promise<GitHubIssue>;
  getIssue(issueNumber: number): Promise<GitHubIssue>;
  listIssues(): Promise<GitHubIssue[]>;
  updateIssue(
    issueNumber: number,
    input: GitHubIssueUpdateInput
  ): Promise<GitHubIssue>;
};
