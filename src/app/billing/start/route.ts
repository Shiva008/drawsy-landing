import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const cadence =
    url.searchParams.get("cadence") === "monthly" ? "monthly" : "annual";
  return NextResponse.redirect(
    new URL(`/pricing?billing=start&cadence=${cadence}`, url.origin),
  );
}
