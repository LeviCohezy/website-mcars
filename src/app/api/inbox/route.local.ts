import { NextResponse, type NextRequest } from "next/server";
import { createItem, InboxError, listItems } from "@/lib/inbox/store";
import type { InboxPayload } from "@/lib/inbox/types";

// `.local.ts`: only part of the server build, never of the static export (see next.config.ts).

/** A form submits a request: multipart with `payload` (JSON) and optional `car<i>.photo|doc` files. */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const raw = form.get("payload");
    if (typeof raw !== "string") return NextResponse.json({ error: "payload ontbreekt" }, { status: 400 });
    const payload = JSON.parse(raw) as InboxPayload;
    const files: { field: string; file: File }[] = [];
    for (const [field, value] of form.entries()) if (value instanceof File && value.size > 0) files.push({ field, file: value });
    const item = await createItem(payload, files);
    return NextResponse.json({ id: item.id }, { status: 201 });
  } catch (e) {
    if (e instanceof InboxError) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof SyntaxError) return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
    console.error("inbox POST", e);
    return NextResponse.json({ error: "Opslaan mislukt" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(await listItems());
}
