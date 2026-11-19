import type { InboxPayload } from "./types";

/**
 * Where the forms post to. Empty in the static GitHub Pages export (no server there), in which
 * case the forms fall back to opening a pre-filled e-mail like before. Set in next.config.ts.
 */
export const INBOX_URL = process.env.NEXT_PUBLIC_INBOX_URL ?? "";

export type InboxFile = { field: string; file: File };

/** Sends a request to the CMS inbox. Resolves false when there is no inbox or it failed. */
export async function sendToInbox(payload: InboxPayload, files: InboxFile[] = []): Promise<boolean> {
  if (!INBOX_URL) return false;
  try {
    const body = new FormData();
    body.set(
      "payload",
      JSON.stringify({ ...payload, page: window.location.pathname, locale: document.documentElement.lang || undefined }),
    );
    for (const f of files) body.append(f.field, f.file, f.file.name);
    const res = await fetch(INBOX_URL, { method: "POST", body });
    return res.ok;
  } catch {
    return false;
  }
}
