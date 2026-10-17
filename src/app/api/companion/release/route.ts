import { fetchCompanionReleaseAssets } from "@/lib/companion/githubRelease";

export async function GET() {
  const release = await fetchCompanionReleaseAssets();
  if (!release) {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
  return Response.json(release, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
