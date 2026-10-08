import { Lock } from "lucide-react";
import { retentionPeriodClaimSk } from "@/config/retention";

export default function GdprBanner() {
  return (
    <aside
      className="steel-panel border-signal/30 bg-signal/5 p-4 sm:p-5"
      role="note"
      aria-label="Ochrana dát a transparentnosť"
    >
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-signal-bright">
        <Lock className="h-4 w-4 shrink-0" aria-hidden />
        Ochrana dát &amp; Transparentnosť pre majiteľov firiem
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-200">
        Vaše odpovede a výsledky auditu slúžia na vygenerovanie správy a
        stanovenie prioritných odporúčaní. Prenos údajov je šifrovaný (HTTPS).{" "}
        {retentionPeriodClaimSk()}.
      </p>
    </aside>
  );
}
