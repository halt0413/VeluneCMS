import type { Context } from "hono";
import { BadRequestError } from "../lib/errors/AppError";

export function requireRouteParam(c: Context, name: string): string {
  const value = c.req.param(name);

  if (!value) {
    throw new BadRequestError(`${name} is required`);
  }

  return value;
}
