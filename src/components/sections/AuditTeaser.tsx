import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Crown,
  Gauge,
  Shield,
} from "lucide-react";
import {
  AUDIT_LEVELS,
  levelBadge,
  personalMeetingHref,
} from "@/config/levels";

const LEVELS = [
  {
    id: "l1",
    href: "/self-audit/#level-1",
    badge: levelBadge(1),
    Icon: Gauge,
    title: "Orientačný skríning",
    price: AUDIT_LEVELS[1].priceLabel,
    priceNote: "20 otázok · 15–20 min",
    border: "border-signal/50 hover:border-signal",
    glow: "shadow-[0_0_0_1px_rgba(47,111,237,0.35),0_16px_48px_rgba(47,111,237,0.12)]",
    badgeClass:
      "border-signal/40 bg-signal/15 text-signal-bright",
    iconClass: "text-signal-bright",
    checkClass: "text-signal-bright",
    points: [
      "Kde unikajú peniaze — v jednom pohľade",
      "Indikatívny potenciál úspor voči referencii MSP",
      "3 prioritné odporúčania pre konateľa",
    ],
  },
  {
    id: "l2",
    href: "/self-audit/#level-2",
    badge: levelBadge(2),
    Icon: Shield,
    title: "Detailný audit",
    price: AUDIT_LEVELS[2].priceLabel,
    priceNote: "60 otázok · rozhodovací podklad",
    border: "border-[#c0c7d4]/70 hover:border-[#e8edf5]",
    glow: "shadow-[0_0_0_1px_rgba(192,199,212,0.35),0_16px_48px_rgba(0,0,0,0.35)]",
    badgeClass: "border-[#c0c7d4]/45 bg-[#c0c7d4]/10 text-[#e8edf5]",
    iconClass: "text-[#c0c7d4]",
    checkClass: "text-[#c0c7d4]",
    points: [
      "Rozpis po otázkach, prioritizácia podľa finančného dopadu, podklad na poradu majiteľov.",
    ],
  },
  {
    id: "l3",
    href: "/self-audit/#level-3",
    badge: levelBadge(3),
    Icon: Crown,
    title: "Expert & DTO",
    price: AUDIT_LEVELS[3].priceLabel,
    priceNote: "180 otázok · 6M + simulátor",
    border: "border-[#d4af37]/75 hover:border-[#f0d78c]",
    glow: "shadow-[0_0_0_1px_rgba(212,175,55,0.4),0_16px_48px_rgba(0,0,0,0.4)]",
    badgeClass: "border-[#d4af37]/45 bg-[#d4af37]/10 text-[#f0d78c]",
    iconClass: "text-[#d4af37]",
    checkClass: "text-[#d4af37]",
    points: [
      "Príčiny strát naprieč 6M dimenziami",
      "What-If simulácia investície a ROI",
      "Pred podpisom rozpočtu — nie po ňom",
    ],
  },
] as const;

export default function AuditTeaser() {
  const meeting = personalMeetingHref();

  return (
    <section
      id="audit"
      className="relative overflow-hidden border-t border-white/5 section-pad"
      aria-labelledby="audit-teaser-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-steel bg-[size:48px_48px] opacity-30"
        aria-hidden
      />

      <div className="container-aveng relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <p className="eyebrow mb-5">Self-Audit · Zrkadlo podniku</p>
          <h2
            id="audit-teaser-heading"
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl"
          >
            Koľko peňazí vám{" "}
            <span className="text-signal-bright">uniká vo výrobe</span> — skôr,
            než to uvidíte vo výsledovke
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
            Tri úrovne diagnostiky pre majiteľov a COO výrobných MSP. Začnite
            zdarma: 20 otázok, indikatívny potenciál úspor a tri priority —
            bez záruky konkrétnych čísiel, s jasnou mapou ďalšieho postupu.
          </p>
        </div>

        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {LEVELS.map((lvl, i) => (
            <li
              key={lvl.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <Link
                href={lvl.href}
                className={`relative flex h-full flex-col rounded-xl border-2 bg-ink-900/70 p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-ink-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6 ${lvl.border} ${lvl.glow} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright`}
                aria-label={`${lvl.badge}: ${lvl.title} — prejsť na audit`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${lvl.badgeClass}`}
                  >
                    <lvl.Icon className="h-3.5 w-3.5" aria-hidden />
                    {lvl.badge}
                  </p>
                  <span className="font-display text-2xl font-semibold text-ink-400">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink-50">
                  {lvl.title}
                </h3>
                <p className="mt-3 font-display text-3xl font-semibold text-ink-50">
                  {lvl.price}
                </p>
                <p className="mt-1 text-xs text-ink-300">{lvl.priceNote}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {lvl.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-ink-100">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${lvl.checkClass}`}
                        aria-hidden
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-bright">
                  Prejsť na audit
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </p>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in">
          <Link href="/self-audit/" className="btn-primary !px-7 !py-3.5 !text-base">
            Spustiť bezplatný self-audit
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href={meeting.href}
            className="btn-secondary !px-6 !py-3.5 inline-flex items-center gap-2"
            {...(meeting.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <Calendar className="h-4 w-4" aria-hidden />
            Dohodnúť osobnú schôdzku
          </a>
        </div>
        <p className="mt-4 text-center text-xs text-ink-300">
          Level 1 je online a zdarma. Level 2/3 odomknete kódom alebo po
          dohode — schôdzku môžete dohodnúť kedykoľvek.
        </p>
      </div>
    </section>
  );
}
