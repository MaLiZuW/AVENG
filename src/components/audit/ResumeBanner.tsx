"use client";

interface Props {
  updatedAt?: string;
  onContinue: () => void;
  onRestart: () => void;
}

export default function ResumeBanner({
  updatedAt,
  onContinue,
  onRestart,
}: Props) {
  const when = updatedAt
    ? new Date(updatedAt).toLocaleString("sk-SK", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : null;

  return (
    <div
      className="steel-panel border-signal/40 p-4 sm:p-5 animate-fade-up"
      role="status"
      aria-live="polite"
    >
      <p className="font-display text-base font-semibold text-ink-50">
        Našla sa rozpracovaná diagnostika
      </p>
      <p className="mt-1 text-sm text-ink-200">
        Chcete pokračovať tam, kde ste skončili?
        {when ? (
          <span className="text-ink-300"> · uložené {when}</span>
        ) : null}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={onContinue}>
          Pokračovať
        </button>
        <button type="button" className="btn-secondary" onClick={onRestart}>
          Začať znova
        </button>
      </div>
    </div>
  );
}
