import { requireChatGPTUser } from "../chatgpt-auth";

const ADMIN_EMAILS = new Set(["srbmaury@gmail.com"]);

export async function requireAdmin(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  return { user, allowed: ADMIN_EMAILS.has(user.email.toLowerCase()) };
}
