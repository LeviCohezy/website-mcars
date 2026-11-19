import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "@/lib/inbox/store";

/** Serves one uploaded photo or document. `?download` forces a download instead of opening it. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; file: string }> }) {
  const { id, file } = await params;
  const found = await readFile(id, decodeURIComponent(file));
  if (!found) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  const disposition = req.nextUrl.searchParams.has("download") ? "attachment" : "inline";
  return new NextResponse(new Uint8Array(found.data), {
    headers: {
      "Content-Type": found.ref.type,
      "Content-Length": String(found.data.length),
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(found.ref.name)}`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
