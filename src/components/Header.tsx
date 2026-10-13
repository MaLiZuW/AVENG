"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, Menu, Shield, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Domov" },
  { href: "/o-nas/", label: "O nás" },
  { href: "/sluzby/", label: "Služby" },
  { href: "/optimalizacia-a-ai/", label: "Optimalizácia & AI" },
  { href: "/self-audit/", label: "Self-Audit" },
  { href: "/kontakt/", label: "Kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-shadow ${
        scrolled ? "glass-nav shadow-glass" : "glass-nav"
      }`}
    >
      <div className="container-aveng flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
          aria-label="AddValueEngineering Domov"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-signal">
            <img
              src="/aveng-mark-white.png"
              alt=""
              width={36}
              height={36}
              className="h-[118%] w-[118%] max-w-none object-contain"
              decoding="async"
            />
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-ink-50 sm:text-lg">
            AddValue
            <span className="text-signal-bright">Engineering</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Hlavná navigácia"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-2 text-sm text-ink-200 transition hover:bg-white/5 hover:text-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <span
            className="inline-flex items-center gap-1 text-[11px] text-ink-200"
            title="Šifrované spojenie"
          >
            <Lock className="h-3 w-3" aria-hidden />
            HTTPS
          </span>
          <span
            className="inline-flex items-center gap-1 text-[11px] text-ink-200"
            title="GDPR"
          >
            <Shield className="h-3 w-3" aria-hidden />
            GDPR
          </span>
          <Link
            href="/self-audit/"
            className="btn-primary !h-9 !px-4 !py-0 !text-xs leading-none"
          >
            Spustiť audit zdarma
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-ink-950/95 px-5 py-4 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobilná navigácia">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm text-ink-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/self-audit/"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              Spustiť audit zdarma
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
