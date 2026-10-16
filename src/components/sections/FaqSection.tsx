/**
 * Homepage FAQ — visible markup must match JSON-LD FAQPage.
 */

import { ChevronRight } from "lucide-react";
import { HOME_FAQ } from "@/content/home-faq";

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="section-pad border-t border-white/5"
      aria-labelledby="faq-heading"
    >
      <div className="container-aveng max-w-3xl">
        <p className="eyebrow mb-4">FAQ</p>
        <h2 id="faq-heading" className="heading-display">
          Časté otázky
        </h2>
        <ul className="mt-10 space-y-4">
          {HOME_FAQ.map((item) => (
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
      </div>
    </section>
  );
}

export { HOME_FAQ as FAQ };
