import { listItems } from "@/lib/inbox/store";
import InboxApp from "./inbox-app";

export const dynamic = "force-dynamic";

/** /cms — every request sent through the site's forms. `?id=` opens one. */
export default async function CmsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <InboxApp initial={await listItems()} initialId={id} />;
}
