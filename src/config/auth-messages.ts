export const authMessages = {
  invalidEmail: "Enter a valid email address.",
  invalidPassword: "The email or password is incorrect.",
  passwordTooShort: "Choose a password with at least 6 characters.",
  passwordMismatch: "The passwords do not match.",
  nameRequired: "Please enter your name.",
  emailExists: "An account with this email already exists. Sign in instead.",
  networkError: "Something went wrong. Please try again.",
  forgotPasswordSent:
    "If an account exists for that email, we sent a password reset link.",
  resetSuccess: "Your password has been reset. You can sign in now.",
  resetViaEmail:
    "Password reset is handled by the link in your email. Open that link, set a new password, then sign in.",
  resetTokenMissing: "This reset link is invalid or has expired.",
  requiredFields: "Please fill in all required fields.",
  verifyEmailTitle: "Verify your email",
  verifyEmailBody:
    "We sent a verification link to your inbox. Open it, then continue.",
  verifyEmailResent: "Verification email sent again.",
  verifyEmailPending:
    "Your email is not verified yet. Open the link, then try again.",
  redirecting: "Taking you to your workspace…",
  firebaseNotConfigured:
    "Drawsy authentication is not configured. Set NEXT_PUBLIC_DRAWSY_FIREBASE_CONFIG.",
} as const;
