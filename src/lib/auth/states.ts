export type SignupState =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export type LoginState =
  | "idle"
  | "submitting"
  | "authenticated"
  | "invalid_credentials"
  | "error";

export type ForgotPasswordState =
  | "idle"
  | "submitting"
  | "sent"
  | "error";

export type ResetPasswordState =
  | "idle"
  | "submitting"
  | "success"
  | "error";
