/** Build an auth URL that prefills the email field (`?email=`). */
export function loginWithEmailHref(
  email: string,
  path = "/login",
  extra?: Record<string, string | null | undefined>,
) {
  const params = new URLSearchParams();
  const trimmed = email.trim();
  if (trimmed) params.set("email", trimmed);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export function readPrefillEmail(searchParams: {
  get: (key: string) => string | null;
}) {
  const raw = searchParams.get("email")?.trim() ?? "";
  if (!raw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return "";
  return raw;
}
