import { getProductReleases } from "@/lib/product-releases";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json(await getProductReleases(), { headers: { "Cache-Control": "no-store" } });
}
