"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseAuth } from "@/lib/supabaseAuth";

const ISSUE_URL =
  process.env.NEXT_PUBLIC_ISSUE_UNLOCK_API_URL?.trim() ??
  (process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/functions/v1/issue-unlock-code`
    : "");

type Level = 2 | 3;

export default function AdminUnlockPanel() {
  const sb = getSupabaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [boot, setBoot] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);

  const [level, setLevel] = useState<Level>(2);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [issuePending, setIssuePending] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    code: string;
    emailed: boolean;
    warning?: string;
  } | null>(null);

  useEffect(() => {
    if (!sb) {
      setBoot(false);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setBoot(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    if (!sb) {
      setLoginError("Supabase nie je nakonfigurované.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setLoginPending(true);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoginPending(false);
    if (error) {
      setLoginError(error.message || "Prihlásenie zlyhalo.");
    }
  }

  async function onLogout() {
    await sb?.auth.signOut();
    setResult(null);
    setIssueError(null);
  }

  async function onIssue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIssueError(null);
    setResult(null);
    if (!sb || !ISSUE_URL) {
      setIssueError("Issue API nie je nakonfigurované.");
      return;
    }
    const { data: sessionData } = await sb.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setIssueError("Session vypršala — prihláste sa znova.");
      return;
    }

    setIssuePending(true);
    try {
      const res = await fetch(ISSUE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          level,
          recipient_email: recipientEmail.trim(),
          recipient_name: recipientName.trim(),
          company_name: companyName.trim(),
          note: note.trim(),
          send_email: sendEmail,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        emailed?: boolean;
        warning?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.code) {
        setIssueError(data.error ?? `Chyba ${res.status}`);
      } else {
        setResult({
          code: data.code,
          emailed: Boolean(data.emailed),
          warning: data.warning,
        });
      }
    } catch {
      setIssueError("Sieťová chyba pri odosielaní.");
    }
    setIssuePending(false);
  }

  if (boot) {
    return (
      <p className="text-sm text-ink-300" role="status">
        Načítavam…
      </p>
    );
  }

  if (!sb) {
    return (
      <p className="text-sm text-red-400" role="alert">
        Chýba NEXT_PUBLIC_SUPABASE_URL / ANON_KEY.
      </p>
    );
  }

  if (!user) {
    return (
      <form
        onSubmit={onLogin}
        className="steel-panel space-y-4 p-5"
        noValidate
      >
        <h2 className="font-display text-lg font-semibold text-ink-50">
          Prihlásenie
        </h2>
        <label className="block text-sm">
          <span className="mb-1 block text-ink-200">E-mail</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-ink-200">Heslo</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
          />
        </label>
        {loginError && (
          <p className="text-sm text-red-400" role="alert">
            {loginError}
          </p>
        )}
        <button type="submit" className="btn-primary" disabled={loginPending}>
          {loginPending ? "Prihlasujem…" : "Prihlásiť sa"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-200">
        <span>
          Prihlásený: <span className="text-ink-50">{user.email}</span>
        </span>
        <button type="button" className="btn-secondary !py-1.5 !text-xs" onClick={onLogout}>
          Odhlásiť
        </button>
      </div>

      <form onSubmit={onIssue} className="steel-panel space-y-4 p-5" noValidate>
        <h2 className="font-display text-lg font-semibold text-ink-50">
          Vygenerovať a odoslať kód
        </h2>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink-100">Level</legend>
          <div className="flex gap-2">
            {([2, 3] as const).map((l) => (
              <label
                key={l}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition ${
                  level === l
                    ? "border-signal bg-signal/15 text-ink-50"
                    : "border-white/10 text-ink-200 hover:border-white/25"
                }`}
              >
                <input
                  type="radio"
                  name="level"
                  className="sr-only"
                  checked={level === l}
                  onChange={() => setLevel(l)}
                />
                Level {l}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-ink-200">E-mail klienta</span>
            <input
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-ink-200">Meno (voliteľné)</span>
            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-ink-200">Firma (voliteľné)</span>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-ink-200">Poznámka (len pre vás)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Napr. faktúra #123"
              className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
            />
          </label>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-200">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
            className="h-4 w-4 accent-signal"
          />
          Odoslať kód e-mailom klientovi (kópia tebe)
        </label>

        {issueError && (
          <p className="text-sm text-red-400" role="alert">
            {issueError}
          </p>
        )}

        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={issuePending}>
          {issuePending ? "Generujem…" : "Vygenerovať a odoslať"}
        </button>
      </form>

      {result && (
        <div className="steel-panel space-y-2 p-5" role="status">
          <p className="text-sm text-ink-200">Kód bol vytvorený</p>
          <p className="font-display text-2xl font-semibold tracking-wide text-ember">
            {result.code}
          </p>
          <p className="text-sm text-ink-200">
            {result.emailed
              ? `E-mail odoslaný na ${recipientEmail}.`
              : "E-mail nebol odoslaný — skopírujte kód manuálne."}
          </p>
          {result.warning && (
            <p className="text-sm text-ember">{result.warning}</p>
          )}
        </div>
      )}
    </div>
  );
}
