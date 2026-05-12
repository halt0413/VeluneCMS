import {
  createIssue,
  createIssueFromCmsPage,
  getIssue,
  listIssues,
  updateIssue,
  updateIssueLabels
} from "@repo/github";
import type {
  GitHubIssue,
  GitHubIssueCreateResult,
  GitHubIssueGateway,
  GitHubIssueInput,
  GitHubIssueLabel,
  GitHubIssueUpdateInput
} from "../../domain";
import type { CmsPage } from "../../domain";
import { ConfigurationError } from "../../lib/errors/AppError";

type OctokitGitHubIssueGatewayConfig = {
  owner?: string;
  repo?: string;
  token?: string;
};

export class OctokitGitHubIssueGateway implements GitHubIssueGateway {
  constructor(private readonly config: OctokitGitHubIssueGatewayConfig) {}

  async addLabels(
    issueNumber: number,
    labels: GitHubIssueLabel[]
  ): Promise<GitHubIssue> {
    const config = this.requireConfig();
    await updateIssueLabels({
      ...config,
      issueNumber,
      labels
    });

    return this.getIssue(issueNumber);
  }

  async createFromPage(page: CmsPage): Promise<GitHubIssueCreateResult> {
    const { owner, repo, token } = this.requireConfig();

    const issue = await createIssueFromCmsPage({
      owner,
      repo,
      token,
      page
    });

    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url
    };
  }

  async createIssue(input: GitHubIssueInput): Promise<GitHubIssue> {
    const issue = await createIssue({
      ...this.requireConfig(),
      input
    });

    return this.toGitHubIssue(issue);
  }

  async getIssue(issueNumber: number): Promise<GitHubIssue> {
    const issue = await getIssue({
      ...this.requireConfig(),
      issueNumber
    });

    return this.toGitHubIssue(issue);
  }

  async listIssues(): Promise<GitHubIssue[]> {
    const issues = await listIssues(this.requireConfig());
    return issues.map((issue) => this.toGitHubIssue(issue));
  }

  async updateIssue(
    issueNumber: number,
    input: GitHubIssueUpdateInput
  ): Promise<GitHubIssue> {
    const issue = await updateIssue({
      ...this.requireConfig(),
      issueNumber,
      input
    });

    return this.toGitHubIssue(issue);
  }

  private requireConfig(): { owner: string; repo: string; token: string } {
    const { owner, repo, token } = this.config;

    if (!owner || !repo || !token) {
      throw new ConfigurationError(
        "GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO are required"
      );
    }

    return {
      owner,
      repo,
      token
    };
  }

  private toGitHubIssue(issue: {
    body?: string | null;
    html_url: string;
    id: number;
    labels: Array<string | { name?: string | null }>;
    number: number;
    state: string;
    title: string;
  }): GitHubIssue {
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body ?? null,
      url: issue.html_url,
      state: issue.state === "open" ? "open" : "closed",
      labels: issue.labels.flatMap((label) => {
        if (typeof label === "string") {
          return [label];
        }

        return label.name ? [label.name] : [];
      })
    };
  }
}
