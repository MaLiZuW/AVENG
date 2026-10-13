"use client";

import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import GdprLink from "@/components/GdprModal";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { company } from "@/config/company";
import { contactIntentPrefill } from "@/config/levels";
import { submitSiteContact } from "@/lib/submitSiteContact";

const schema = z.object({
  fullName: z.string().min(2, "Zadajte meno").max(120, "Meno je príliš dlhé"),
  email: z
    .string()
    .email("Zadajte platný e-mail")
    .max(254, "E-mail je príliš dlhý"),
  companyName: z
    .string()
    .min(2, "Zadajte firmu")
    .max(200, "Názov firmy je príliš dlhý"),
  subject: z.string().max(160, "Predmet je príliš dlhý"),
  message: z
    .string()
    .min(10, "Správa je príliš krátka")
    .max(4000, "Správa je príliš dlhá"),
  consent: z.literal(true, {
    message: "Je potrebný súhlas so spracovaním údajov",
  }),
});

export default function KontaktPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();

  useEffect(() => {
    const predmet = new URLSearchParams(window.location.search).get("predmet");
    const prefill = contactIntentPrefill(predmet);
    if (!prefill) return;
    setSubject(prefill.subject);
    setMessage(prefill.message);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const website = String(fd.get("website") ?? "");
    const subjectText = String(fd.get("subject") ?? "").trim();
    const messageText = String(fd.get("message") ?? "").trim();
    const composed = subjectText
      ? `Predmet: ${subjectText}\n\n${messageText}`
      : messageText;
    const parsed = schema.safeParse({
      fullName: String(fd.get("fullName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      companyName: String(fd.get("companyName") ?? "").trim(),
      subject: subjectText,
      message: messageText,
      consent: fd.get("consent") === "on",
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Skontrolujte formulár");
      return;
    }
    if (composed.length > 4000) {
      setError("Správa je príliš dlhá");
      return;
    }
    if (website.trim()) {
      setDone(true);
      return;
    }

    setPending(true);
    const res = await submitSiteContact({
      name: parsed.data.fullName,
      email: parsed.data.email,
      company: parsed.data.companyName,
      message: composed,
      consent: true,
      website: "",
    });
    setPending(false);
    if (!res.ok) {
      setError(
        res.error ??
          "Odoslanie sa nepodarilo. Napíšte nám prosím na vladimir@addvalueengineering.sk.",
      );
      return;
    }
    setDone(true);
  }

  return (
    <>
      <Header />
      <main className="section-pad">
        <div className="container-aveng max-w-2xl">
          <p className="eyebrow mb-4">Kontakt</p>
          <h1 className="heading-display">Napíšte nám</h1>
          <p className="prose-muted mt-4">
            {company.brandName} · {company.addressDisplay} ·{" "}
            <a
              href={`mailto:${company.email}`}
              className="text-signal-bright hover:underline"
            >
              {company.email}
            </a>
          </p>

          {bookingUrl ? (
            <a
              href={bookingUrl}
              className="btn-primary mt-6 inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dohodnúť 30-minútovú konzultáciu
            </a>
          ) : null}

          {done ? (
            <div className="steel-panel mt-8 p-6" role="status">
              <p className="font-display text-lg font-semibold text-signal-bright">
                Ďakujeme — správa bola odoslaná
              </p>
              <p className="mt-2 text-sm text-ink-200">
                Ozveme sa vám na uvedený e-mail.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="steel-panel mt-8 space-y-4 p-6"
              noValidate
            >
              {/* honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden
              />
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">Meno</span>
                <input
                  name="fullName"
                  required
                  maxLength={120}
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">E-mail</span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">Firma</span>
                <input
                  name="companyName"
                  required
                  maxLength={200}
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">Predmet</span>
                <input
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={160}
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">Správa</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  maxLength={4000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="flex items-start gap-3 text-sm text-ink-200">
                <input
                  type="checkbox"
                  name="consent"
                  className="mt-1 accent-signal"
                  required
                />
                <span>
                  Súhlasím so spracovaním osobných údajov.{" "}
                  <GdprLink className="text-signal-bright underline-offset-2 hover:underline" />
                  .
                </span>
              </label>
              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending ? "Odosielam…" : "Odoslať správu"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
