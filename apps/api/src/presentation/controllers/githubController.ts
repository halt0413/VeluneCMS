import type {
  IssueCreateRequest,
  IssueCreateResponse,
  IssueItemResponse,
  IssueLabelsResponse,
  IssueLabelsUpdateRequest,
  IssuesListResponse,
  IssueUpdateRequest,
  IssueUpdateResponse
} from "../contracts";
import type { Context } from "hono";
import { requireIssueNumber } from "../params";
import type { GitHubControllerHandlers } from "../types";

export function createGitHubController({
  addIssueLabels,
  createIssue,
  getIssue,
  listIssues,
  updateIssue
}: GitHubControllerHandlers) {
  return {
    async list(c: Context) {
      const items = await listIssues();
      const response: IssuesListResponse = {
        items,
        total: items.length
      };

      return c.json(response);
    },
    async get(c: Context) {
      const item = await getIssue(requireIssueNumber(c));
      const response: IssueItemResponse = {
        item
      };

      return c.json(response);
    },
    async create(c: Context) {
      const payload = (await c.req.json()) as IssueCreateRequest;
      const created = await createIssue(payload);
      const response: IssueCreateResponse = {
        created
      };

      return c.json(response, 201);
    },
    async update(c: Context) {
      const payload = (await c.req.json()) as IssueUpdateRequest;
      const updated = await updateIssue(requireIssueNumber(c), payload);
      const response: IssueUpdateResponse = {
        updated
      };

      return c.json(response);
    },
    async updateLabels(c: Context) {
      const payload = (await c.req.json()) as IssueLabelsUpdateRequest;
      const updated = await addIssueLabels(requireIssueNumber(c), payload.labels);
      const response: IssueLabelsResponse = {
        updated
      };

      return c.json(response);
    }
  };
}
