import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="section-pad">
        <div className="container-aveng max-w-3xl">
          <p className="eyebrow mb-4">404</p>
          <h1 className="heading-display">Stránka sa nenašla</h1>
          <p className="prose-muted mt-4">
            Táto adresa na webe nie je. Vráťte sa na úvodnú stránku alebo
            pokračujte na self-audit.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Úvodná stránka
            </Link>
            <Link href="/self-audit/" className="btn-secondary">
              Self-audit
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
