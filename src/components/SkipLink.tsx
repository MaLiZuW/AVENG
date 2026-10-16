/** First focusable control — jumps past the fixed header (WCAG 2.4.1). */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute left-4 top-4 z-[100] -translate-y-[120%] rounded-md bg-signal px-4 py-3 text-sm font-semibold text-white outline-none transition-transform focus:translate-y-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-signal-bright"
    >
      Preskočiť na obsah
    </a>
  );
}
