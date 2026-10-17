import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = () => {
  const raw = process.env.NEXT_PUBLIC_DRAWSY_FIREBASE_CONFIG;
  if (!raw) {
    throw new Error("Drawsy authentication is not configured.");
  }
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    throw new Error("Drawsy authentication configuration is invalid.");
  }
};

export const getDrawsyAuth = () => {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig());
  return getAuth(app);
};
