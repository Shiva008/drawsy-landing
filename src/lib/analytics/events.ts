export const analyticsEvents = {
  signup_viewed: "signup_viewed",
  signup_started: "signup_started",
  signup_email_submitted: "signup_email_submitted",
  google_signup_started: "google_signup_started",
  google_signup_completed: "google_signup_completed",
  twitter_signup_started: "twitter_signup_started",
  twitter_signup_completed: "twitter_signup_completed",

  login_viewed: "login_viewed",
  login_success: "login_success",
  login_failed: "login_failed",
  google_login_started: "google_login_started",
  twitter_login_started: "twitter_login_started",

  forgot_password_started: "forgot_password_started",
  forgot_password_submitted: "forgot_password_submitted",
  password_reset_completed: "password_reset_completed",
} as const;

export type AnalyticsEvent =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

/**
 * Placeholder until an analytics vendor is wired.
 * Production vendors must stay behind `hasConsent("analytics")`.
 */
export function track(event: AnalyticsEvent, props?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") return;
  // Dev-only console — not a third-party cookie / tracker.
  console.debug("[analytics]", event, props ?? {});
}
