import { createHmac, timingSafeEqual } from "node:crypto";
import type { WebhookResponse } from "@repo/types";
import type { Context } from "hono";
import {
  BadRequestError,
  UnauthorizedError
} from "../../lib/errors/AppError";

type CreateWebhookControllerDependencies = {
  secret: string;
};

export function createWebhookController({
  secret
}: CreateWebhookControllerDependencies) {
  return {
    async receive(c: Context) {
      const signature = c.req.header("x-hub-signature-256");

      if (!signature) {
        throw new UnauthorizedError("Missing webhook signature");
      }

      const rawBody = await c.req.text();

      if (!isValidWebhookSignature(rawBody, signature, secret)) {
        throw new UnauthorizedError("Invalid webhook signature");
      }

      let payload: unknown;

      try {
        payload = JSON.parse(rawBody);
      } catch {
        throw new BadRequestError("Invalid webhook payload");
      }

      const response: WebhookResponse = {
        received: true,
        payload
      };

      return c.json(response);
    }
  };
}

function isValidWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = `sha256=${createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")}`;
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
