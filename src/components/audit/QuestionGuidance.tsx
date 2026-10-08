interface Props {
  goal: string;
  methodology: string;
  verification: string;
}

export default function QuestionGuidance({
  goal,
  methodology,
  verification,
}: Props) {
  return (
    <aside
      className="grid gap-3 sm:grid-cols-3"
      aria-label="Kontext otázky"
    >
      <div className="rounded-md border border-white/10 bg-ink-900/50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-signal-bright">
          Kam otázka smeruje
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-200">{goal}</p>
      </div>
      <div className="rounded-md border border-white/10 bg-ink-900/50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ember">
          Použitá metodika
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-200">
          {methodology}
        </p>
      </div>
      <div className="rounded-md border border-white/10 bg-ink-900/50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-green-400">
          Metóda overenia
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-200">
          {verification}
        </p>
      </div>
    </aside>
  );
}
