import { NextResponse, type NextRequest } from "next/server";
import { deleteItem, getItem, updateItem } from "@/lib/inbox/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await getItem((await params).id);
  return item ? NextResponse.json(item) : NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
}

/** { status?, notitie? } */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const patch = await req.json().catch(() => null);
  if (!patch || typeof patch !== "object") return NextResponse.json({ error: "Ongeldige body" }, { status: 400 });
  const item = await updateItem((await params).id, patch);
  return item ? NextResponse.json(item) : NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  return (await deleteItem((await params).id))
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
}
