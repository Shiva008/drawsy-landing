import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getIdToken,
  getIdTokenResult,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signInWithPopup,
  TwitterAuthProvider,
  type User,
} from "firebase/auth";

import { getDrawsyAuth } from "./firebase";

const authFailure = (message: string, code: string) =>
  Object.assign(new Error(message), { code });

const postToken = async <T>(path: string, idToken: string): Promise<T> => {
  const response = await fetch(path, {
    method: "POST",
    cache: "no-store",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw authFailure(
        "Your session expired. Sign in again.",
        "AUTH_EXPIRED",
      );
    }
    if (response.status === 403) {
      throw authFailure(
        "This account cannot continue until email is verified.",
        "AUTH_FORBIDDEN",
      );
    }
    if (response.status === 503) {
      throw authFailure(
        "Drawsy is temporarily unavailable. Try again in a moment.",
        "AUTH_UNAVAILABLE",
      );
    }
    throw authFailure("Sign-in could not complete.", "AUTH_FAILED");
  }
  return (await response.json()) as T;
};

export type DrawsyAuthResult = {
  handoffCode?: string;
  verificationRequired?: boolean;
  email?: string;
};

export const getFirebaseAuthErrorCode = (error: unknown) => {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : "";
};

export const isCancelledAuthError = (error: unknown) =>
  [
    "AUTH_CANCELLED",
    "auth/cancelled-popup-request",
    "auth/popup-closed-by-user",
  ].includes(getFirebaseAuthErrorCode(error));

const createAuthError = (code: string, message: string) =>
  Object.assign(new Error(message), { code });

const getSignInProvider = (claims: Record<string, unknown>) => {
  const firebaseClaims = claims.firebase;
  if (!firebaseClaims || typeof firebaseClaims !== "object") {
    return null;
  }
  const provider = (firebaseClaims as Record<string, unknown>).sign_in_provider;
  return typeof provider === "string" ? provider : null;
};

const emailVerificationRequiredError = () =>
  createAuthError(
    "AUTH_EMAIL_NOT_VERIFIED",
    "Email verification is required.",
  );

const assertEmailPasswordIsVerified = (
  user: User,
  claims: Record<string, unknown>,
) => {
  if (getSignInProvider(claims) === "password" && !user.emailVerified) {
    throw emailVerificationRequiredError();
  }
};

export async function ensureDrawsySession(
  user: User,
  forceRefresh = false,
): Promise<User> {
  const auth = getDrawsyAuth();
  const current = await getIdTokenResult(user, forceRefresh);
  assertEmailPasswordIsVerified(user, current.claims);
  if (typeof current.claims.drawsySessionId === "string") {
    return user;
  }
  const bootstrap = await postToken<{ customToken: string }>(
    "/api/auth/bootstrap",
    current.token,
  );
  return (await signInWithCustomToken(auth, bootstrap.customToken)).user;
}

export async function exchangeDrawsyAuthHandoff(code: string): Promise<User> {
  const response = await fetch("/api/auth/handoff/exchange", {
    method: "POST",
    cache: "no-store",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {
    throw new Error("The Drawsy account handoff is invalid or expired.");
  }
  const payload = (await response.json()) as { customToken?: string };
  if (!payload.customToken) {
    throw new Error("The Drawsy account handoff is invalid or expired.");
  }
  return (await signInWithCustomToken(getDrawsyAuth(), payload.customToken))
    .user;
}

export async function signInWithGoogle({
  createCanvasHandoff,
}: {
  createCanvasHandoff: boolean;
}): Promise<DrawsyAuthResult> {
  const auth = getDrawsyAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const google = await signInWithPopup(auth, provider);
  return completeProviderSignIn(google.user, createCanvasHandoff);
}

export async function signInWithX({
  createCanvasHandoff,
}: {
  createCanvasHandoff: boolean;
}): Promise<DrawsyAuthResult> {
  const auth = getDrawsyAuth();
  const provider = new TwitterAuthProvider();
  const x = await signInWithPopup(auth, provider);
  return completeProviderSignIn(x.user, createCanvasHandoff);
}

const completeProviderSignIn = async (
  user: User,
  createCanvasHandoff: boolean,
  forceRefresh = false,
): Promise<DrawsyAuthResult> => {
  const current = await getIdTokenResult(user, forceRefresh);
  if (getSignInProvider(current.claims) === "password" && !user.emailVerified) {
    return {
      verificationRequired: true,
      email: user.email ?? undefined,
    };
  }

  const sessionUser = await ensureDrawsySession(user, forceRefresh);
  if (!createCanvasHandoff) {
    return {};
  }
  return postToken<{ handoffCode: string }>(
    "/api/auth/handoff",
    await getIdToken(sessionUser),
  );
};

export async function signInWithEmail({
  email,
  password,
  createCanvasHandoff,
}: {
  email: string;
  password: string;
  createCanvasHandoff: boolean;
}): Promise<DrawsyAuthResult> {
  const credential = await signInWithEmailAndPassword(
    getDrawsyAuth(),
    email.trim(),
    password,
  );
  return completeProviderSignIn(credential.user, createCanvasHandoff);
}

export async function signUpWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<DrawsyAuthResult> {
  const credential = await createUserWithEmailAndPassword(
    getDrawsyAuth(),
    email.trim(),
    password,
  );
  await sendEmailVerification(credential.user);
  return {
    verificationRequired: true,
    email: credential.user.email ?? email.trim(),
  };
}

export async function resendDrawsyEmailVerification() {
  const user = getDrawsyAuth().currentUser;
  if (
    !user ||
    getSignInProvider((await getIdTokenResult(user)).claims) !== "password"
  ) {
    throw createAuthError(
      "AUTH_EMAIL_VERIFICATION_UNAVAILABLE",
      "Email verification is unavailable for this session.",
    );
  }
  await sendEmailVerification(user);
}

export async function refreshDrawsyEmailVerification({
  createCanvasHandoff,
}: {
  createCanvasHandoff: boolean;
}): Promise<DrawsyAuthResult> {
  const user = getDrawsyAuth().currentUser;
  if (!user) {
    throw createAuthError("AUTH_REQUIRED", "A signed-in user is required.");
  }
  await reload(user);
  return completeProviderSignIn(user, createCanvasHandoff, true);
}

export async function sendDrawsyPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(getDrawsyAuth(), email.trim());
  } catch (error) {
    // Do not reveal whether an address exists.
    if (getFirebaseAuthErrorCode(error) !== "auth/user-not-found") {
      throw error;
    }
  }
}
