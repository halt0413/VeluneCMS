export type WebhookResponse<TPayload = unknown> = {
  received: true;
  payload: TPayload;
};
