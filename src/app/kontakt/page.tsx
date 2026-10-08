"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { company } from "@/config/company";
import { submitContactRequest } from "@/lib/submitContactRequest";

const schema = z.object({
  fullName: z.string().min(2, "Zadajte meno"),
  email: z.string().email("Zadajte platný e-mail"),
  companyName: z.string().min(2, "Zadajte firmu"),
  message: z.string().min(10, "Správa je príliš krátka"),
  website: z.string().max(0).optional(), // honeypot
  consent: z.literal(true, {
    message: "Je potrebný súhlas so spracovaním údajov",
  }),
});

export default function KontaktPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      fullName: String(fd.get("fullName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      companyName: String(fd.get("companyName") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
      consent: fd.get("consent") === "on",
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Skontrolujte formulár");
      return;
    }
    if (parsed.data.website) {
      setDone(true);
      return;
    }

    setPending(true);
    const res = await submitContactRequest({
      requestType: "meeting",
      fullName: parsed.data.fullName,
      company: parsed.data.companyName,
      phone: "",
      email: parsed.data.email,
      message: parsed.data.message,
      meta: { source: "Kontaktná stránka /kontakt" },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Odoslanie zlyhalo");
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
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">E-mail</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">Firma</span>
                <input
                  name="companyName"
                  required
                  className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ink-200">Správa</span>
                <textarea
                  name="message"
                  rows={5}
                  required
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
                  Súhlasím so spracovaním údajov podľa{" "}
                  <Link
                    href="/ochrana-osobnych-udajov/"
                    className="text-signal-bright underline-offset-2 hover:underline"
                  >
                    Zásad ochrany osobných údajov
                  </Link>
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
