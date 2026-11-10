export default function StaticRedirect({
  destination,
}: {
  destination: string;
}) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <main className="site-main section-pad">
        <div className="container-aveng">
          <p>
            Táto stránka sa presúva.{" "}
            <a href={destination} className="text-signal-bright underline">
              Pokračovať na aktuálnu stránku
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
