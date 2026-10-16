import { ChevronRight } from "lucide-react";
import type { FaqItem } from "@/content/types";

type PageFaqProps = {
  items: readonly FaqItem[];
  headingId?: string;
  title?: string;
};

/** Visible FAQ — must match the page's FAQPage JSON-LD 1:1. */
export default function PageFaq({
  items,
  headingId = "faq-heading",
  title = "Časté otázky",
}: PageFaqProps) {
  if (items.length === 0) return null;
  return (
    <section
      id="faq"
      className="mt-14 border-t border-white/5 pt-10"
      aria-labelledby={headingId}
    >
      <p className="eyebrow mb-4">FAQ</p>
      <h2 id={headingId} className="heading-display">
        {title}
      </h2>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item.q}>
            <details className="group rounded-md border border-white/10 bg-ink-900/40 px-4 py-3">
              <summary className="cursor-pointer list-none font-semibold text-ink-50 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-signal-bright transition group-open:rotate-90 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-200">
                {item.a}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
