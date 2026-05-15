import { listContents } from "../infrastructure";

export async function listContentsUseCase() {
  return listContents();
}
