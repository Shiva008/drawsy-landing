import { getFirebaseAuthErrorCode } from "./google";

export function getAuthErrorMessage(
  error: unknown,
  mode: "email" | "reset" = "email",
) {
  const code =
    getFirebaseAuthErrorCode(error) ||
    (error instanceof Error && error.message.startsWith("AUTH_")
      ? error.message
      : "");

  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Sign in instead.";
    case "auth/weak-password":
      return "Choose a password with at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment, then try again.";
    case "auth/network-request-failed":
      return "The network request failed. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase yet.";
    case "AUTH_EMAIL_NOT_VERIFIED":
      return "Verify your email before continuing.";
    case "AUTH_EMAIL_VERIFICATION_UNAVAILABLE":
      return "Start email sign-in again to resend verification.";
    case "AUTH_FAILED":
      return "Signed in with Firebase, but Drawsy session setup failed. Check DRAWSY_BACKEND_URL.";
    default:
      return mode === "reset"
        ? "We could not send the reset email. Please try again."
        : "We could not complete email sign-in. Please try again.";
  }
}
