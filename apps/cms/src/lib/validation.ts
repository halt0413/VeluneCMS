import { ZodError } from "zod";

export function getValidationErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "入力内容を確認してください";
  }

  return "入力内容を確認してください";
}
