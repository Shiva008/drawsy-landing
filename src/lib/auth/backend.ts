const getBackendUrl = () => {
  const value = process.env.DRAWSY_BACKEND_URL?.trim();
  if (!value) return null;
  return value.replace(/\/$/, "");
};

const unavailable = () =>
  Response.json(
    { error: "backend_unavailable" },
    { status: 503, headers: { "cache-control": "no-store" } },
  );

export const authBackend = async (path: string, init?: RequestInit) => {
  const base = getBackendUrl();
  if (!base) return unavailable();
  try {
    return await fetch(`${base}${path}`, { ...init, cache: "no-store" });
  } catch {
    return unavailable();
  }
};

export const assertSameOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  return Boolean(origin) && origin === new URL(request.url).origin;
};
