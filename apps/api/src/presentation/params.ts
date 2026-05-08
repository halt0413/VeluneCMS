import type { Context } from "hono";
import { BadRequestError } from "../lib/errors/AppError";

export function requireIssueNumber(c: Context): number {
  const raw = c.req.param("issueNumber");
  const issueNumber = Number.parseInt(raw ?? "", 10);

  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    throw new BadRequestError("issueNumber must be a positive integer");
  }

  return issueNumber;
}

export function requireRouteParam(c: Context, name: string): string {
  const value = c.req.param(name);

  if (!value) {
    throw new BadRequestError(`${name} is required`);
  }

  return value;
}
