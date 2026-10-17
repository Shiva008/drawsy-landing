/**
 * Auth client surface for the landing UI.
 * Real sign-in is Firebase + same-origin BFF (see google.ts /api/auth/*).
 * This module re-exports the helpers forms/buttons use.
 */

export {
  type DrawsyAuthResult,
  exchangeDrawsyAuthHandoff,
  getFirebaseAuthErrorCode,
  isCancelledAuthError,
  refreshDrawsyEmailVerification,
  resendDrawsyEmailVerification,
  sendDrawsyPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signInWithX,
  signUpWithEmail,
} from "./google";

export { getAuthErrorMessage } from "./errors";
export { logoutDrawsySession } from "./logout";
export {
  completeAuthRedirect,
  destinationIsCanvas,
  resolveAuthDestination,
} from "./redirect";
export {
  isDrawsyAccountEvent,
  notifyAccountChanged,
} from "./accountEvents";
