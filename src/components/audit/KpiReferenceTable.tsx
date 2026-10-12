import type { KpiComparisonRow } from "@/lib/audit/presentation";

interface Props {
  rows: KpiComparisonRow[];
}

function SourceLinks({ row }: { row: KpiComparisonRow }) {
  if (row.sources.length === 0) return <>—</>;
  return (
    <ul className="space-y-1">
      {row.sources.map((source) => (
        <li key={source.url}>
          {source.url.startsWith("https://") ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-2 hover:text-ink-50"
            >
              {source.name}
            </a>
          ) : (
            source.name
          )}
        </li>
      ))}
    </ul>
  );
}

/** Exact-input KPIs against published references. No colour encodes better or worse. */
export default function KpiReferenceTable({ rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <div className="steel-panel overflow-x-auto p-5 sm:p-6">
      <h4 className="font-display text-lg font-semibold text-ink-50">
        Vaše KPI voči orientačným referenciám
      </h4>
      <table className="mt-4 w-full min-w-[640px] text-left text-sm text-ink-100">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-ink-200">
            <th className="pb-2 pr-3 font-medium">Ukazovateľ</th>
            <th className="pb-2 pr-3 font-medium">Vaša hodnota</th>
            <th className="pb-2 pr-3 font-medium">Typický podnik</th>
            <th className="pb-2 pr-3 font-medium">Špička</th>
            <th className="pb-2 font-medium">Zdroj</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-white/5 align-top">
              <td className="py-2.5 pr-3">{row.labelSk}</td>
              <td className="py-2.5 pr-3 font-semibold">{row.userValueSk}</td>
              <td className="py-2.5 pr-3">{row.typicalSk}</td>
              <td className="py-2.5 pr-3">{row.topSk}</td>
              <td className="py-2.5 text-xs leading-relaxed">
                <SourceLinks row={row} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
