"use client";

import { getIdToken, type User } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

import { requestCanvasAuthHandoff } from "@/lib/auth/canvasHandoff";
import { getDrawsyAuth } from "@/lib/auth/firebase";
import {
  ensureDrawsySession,
  exchangeDrawsyAuthHandoff,
} from "@/lib/auth/google";
import { logoutDrawsySession } from "@/lib/auth/logout";
import { useAccountSessionSync } from "@/lib/auth/useAccountSessionSync";
import { authConfig } from "@/config/auth";

type MediaUsage = {
  media: {
    usedBytes: number;
    limitBytes: number;
    remainingBytes: number;
    percentUsed: number;
  };
  counts?: {
    canvases: number;
    projects: number;
    presentations: number;
  };
  documentLimitBytes: number;
  documents: Array<{
    id: string;
    kind: "canvas" | "presentation";
    title: string;
    mediaBytes: number;
    limitBytes: number;
    updatedAt: number;
  }>;
};

type UsageState =
  | { status: "loading"; userId: string | null }
  | { status: "free"; userId: string }
  | { status: "pro"; userId: string; usage: MediaUsage }
  | { status: "error"; userId: string; message: string };

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 ** 3) {
    return `${(bytes / 1024 ** 3).toFixed(bytes >= 10 * 1024 ** 3 ? 0 : 1)} GB`;
  }
  if (bytes >= 1024 ** 2) {
    return `${(bytes / 1024 ** 2).toFixed(bytes >= 10 * 1024 ** 2 ? 0 : 1)} MB`;
  }
  return `${Math.max(0, Math.round(bytes / 1024))} KB`;
};

export function AccountProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [usageState, setUsageState] = useState<UsageState>({
    status: "loading",
    userId: null,
  });
  const [usageRefresh, setUsageRefresh] = useState(0);

  useAccountSessionSync({
    onRevoked: () => setUser(null),
    onEntitlementChanged: () => setUsageRefresh((current) => current + 1),
    redirectToLogin: true,
    returnTo: authConfig.routes.profile,
  });

  useEffect(() => {
    let active = true;
    const auth = getDrawsyAuth();
    void auth
      .authStateReady()
      .then(async () => {
        const url = new URL(window.location.href);
        const directHandoff = url.searchParams.get("handoff");
        if (directHandoff) {
          url.searchParams.delete("handoff");
          window.history.replaceState(null, "", url);
          return exchangeDrawsyAuthHandoff(directHandoff);
        }
        if (auth.currentUser) {
          return ensureDrawsySession(auth.currentUser);
        }
        const handoffCode = await requestCanvasAuthHandoff();
        if (!handoffCode) {
          window.location.replace(
            `${authConfig.routes.login}?returnTo=%2Fprofile`,
          );
          return null;
        }
        return exchangeDrawsyAuthHandoff(handoffCode);
      })
      .then((nextUser) => {
        if (active && nextUser) setUser(nextUser);
      })
      .catch(() => {
        if (active) {
          window.location.replace(
            `${authConfig.routes.login}?returnTo=%2Fprofile`,
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!user) {
      return () => {
        active = false;
      };
    }
    void getIdToken(user)
      .then((idToken) =>
        fetch("/api/account/usage", {
          method: "POST",
          cache: "no-store",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ idToken }),
        }),
      )
      .then(async (response) => {
        if (!active) return;
        if (response.status === 403) {
          setUsageState({ status: "free", userId: user.uid });
          return;
        }
        if (!response.ok) {
          throw new Error("Cloud media usage could not be loaded.");
        }
        setUsageState({
          status: "pro",
          userId: user.uid,
          usage: (await response.json()) as MediaUsage,
        });
      })
      .catch((caught) => {
        if (!active) return;
        setUsageState({
          status: "error",
          userId: user.uid,
          message:
            caught instanceof Error
              ? caught.message
              : "Cloud media usage could not be loaded.",
        });
      });
    return () => {
      active = false;
    };
  }, [usageRefresh, user]);

  const logout = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await logoutDrawsySession();
      setUser(null);
      window.location.replace(authConfig.routes.login);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Sign out could not complete.",
      );
      setBusy(false);
    }
  };

  if (!user) {
    return <p className="account-muted">Loading your account…</p>;
  }

  const currentUsageState =
    usageState.userId === user.uid
      ? usageState
      : ({ status: "loading", userId: user.uid } satisfies UsageState);
  const proUsage =
    currentUsageState.status === "pro" ? currentUsageState.usage : null;
  const storageFull = proUsage?.media.remainingBytes === 0;
  const visibleDocuments = proUsage?.documents
    .filter((document) => document.mediaBytes > 0)
    .slice(0, 8);
  const workspaceCounts = proUsage?.counts
    ? [
        { label: "Canvases", count: proUsage.counts.canvases },
        { label: "Projects", count: proUsage.counts.projects },
        { label: "Presentations", count: proUsage.counts.presentations },
      ]
    : null;

  return (
    <div className="account-panels">
      <section className="account-card">
        <p className="account-card-kicker">Drawsy account</p>
        <h2 className="account-card-title">
          {user.displayName || "Drawsy user"}
        </h2>
        <p className="account-muted">{user.email}</p>
        <div className="account-actions">
          <Link
            className={
              usageState.status === "pro"
                ? "account-btn account-btn-secondary"
                : "account-btn account-btn-primary"
            }
            href={
              usageState.status === "pro"
                ? "/billing"
                : "/billing/start?cadence=annual"
            }
          >
            {usageState.status === "pro"
              ? "Manage billing"
              : usageState.status === "loading"
                ? "Checking plan…"
                : "Upgrade to Pro"}
          </Link>
          <button
            type="button"
            className="account-btn account-btn-secondary"
            disabled={busy}
            onClick={logout}
          >
            {busy ? "Signing out…" : "Sign out this device"}
          </button>
        </div>
        {error ? <p className="account-error">{error}</p> : null}
      </section>

      {currentUsageState.status === "loading" ? (
        <p className="account-muted">Loading account usage…</p>
      ) : null}

      {currentUsageState.status === "free" ? (
        <p className="account-card account-card-soft">
          Your local canvases, projects, and presentations are unlimited. They
          stay private on this device unless you choose to share or export them.
        </p>
      ) : null}

      {currentUsageState.status === "error" ? (
        <p className="account-card account-error">{currentUsageState.message}</p>
      ) : null}

      {proUsage ? (
        <section className="account-card">
          <div className="account-media-head">
            <div>
              <p className="account-card-kicker">Cloud media</p>
              <h3 className="account-card-title">
                {formatBytes(proUsage.media.usedBytes)} of{" "}
                {formatBytes(proUsage.media.limitBytes)}
              </h3>
            </div>
            <p
              className={
                storageFull ? "account-error-inline" : "account-muted"
              }
            >
              {proUsage.media.percentUsed}% used
            </p>
          </div>
          <div
            className="account-progress"
            role="progressbar"
            aria-label="Cloud media storage used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={proUsage.media.percentUsed}
          >
            <div
              className={`account-progress-bar${storageFull ? " is-full" : ""}`}
              style={{
                width: `${Math.max(
                  proUsage.media.usedBytes > 0 ? 1 : 0,
                  proUsage.media.percentUsed,
                )}%`,
              }}
            />
          </div>
          <p className="account-muted account-copy">
            Canvases, projects, and presentations are unlimited. Only media
            stored inside synced documents counts toward this capacity.
          </p>
          {storageFull ? (
            <p className="account-alert">
              Cloud media is 100% full. New media will stay local and will not
              be uploaded. Delete media from a canvas or presentation below to
              resume cloud sync.
            </p>
          ) : null}

          {workspaceCounts ? (
            <div className="account-section">
              <div className="account-section-head">
                <h4>Workspace</h4>
                <span>Unlimited</span>
              </div>
              <div className="account-stat-grid">
                {workspaceCounts.map(({ label, count }) => (
                  <div className="account-stat" key={label}>
                    <p
                      aria-label={`${count} ${label.toLowerCase()} of unlimited`}
                      className="account-stat-value"
                    >
                      {count}{" "}
                      <span aria-hidden="true" className="account-stat-inf">
                        / ∞
                      </span>
                    </p>
                    <p className="account-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {visibleDocuments?.length ? (
            <div className="account-section">
              <div className="account-section-head">
                <h4>Media by document</h4>
                <span>100 MB each</span>
              </div>
              <ul className="account-doc-list">
                {visibleDocuments.map((document) => {
                  const documentFull =
                    document.mediaBytes >= document.limitBytes;
                  return (
                    <li
                      key={`${document.kind}:${document.id}`}
                      className={`account-doc${documentFull ? " is-full" : ""}`}
                    >
                      <div className="account-doc-meta">
                        <p className="account-doc-title">{document.title}</p>
                        <p className="account-muted capitalize">
                          {document.kind}
                          {documentFull ? " · Media full — delete media" : ""}
                        </p>
                      </div>
                      <span
                        className={
                          documentFull
                            ? "account-error-inline"
                            : "account-muted"
                        }
                      >
                        {formatBytes(document.mediaBytes)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
