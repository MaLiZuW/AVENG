import Link from "next/link";

const DEFAULT_CLASS =
  "inline-block text-ink-200 underline-offset-2 hover:text-signal-bright hover:underline";

/**
 * The policy is the static page. This used to be a button that opened a modal.
 */
export default function GdprLink({ className }: { className?: string }) {
  return (
    <Link href="/ochrana-osobnych-udajov/" className={className ?? DEFAULT_CLASS}>
      Zásady spracovania osobných údajov
    </Link>
  );
}
