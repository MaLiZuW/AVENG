import type { Metadata } from "next";
import AdminUnlockPanel from "@/components/admin/AdminUnlockPanel";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    path: "/admin/",
    title: "Admin — prístupové kódy",
    description:
      "Prihláste sa, vygenerujte jednorazový kód a odošlite ho klientovi e-mailom.",
  }),
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="relative min-h-[70vh] px-4 py-16 sm:px-6">
      <div className="mx-auto w-full max-w-lg">
        <p className="text-xs uppercase tracking-[0.16em] text-signal-bright">
          AVENG Admin
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-50">
          Prístupové kódy L2 / L3
        </h1>
        <p className="mt-2 text-sm text-ink-200">
          Prihláste sa, vygenerujte jednorazový kód a odošlite ho klientovi
          e-mailom.
        </p>
        <div className="mt-8">
          <AdminUnlockPanel />
        </div>
      </div>
    </main>
  );
}
