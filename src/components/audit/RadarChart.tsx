"use client";

import { domainLabel } from "@/config/audit-display";
import type { ProcessScore } from "@/lib/audit/types";

interface Props {
  scores: ProcessScore[];
  size?: number;
  showWorldClass?: boolean;
}

function polygonPoints(
  values: number[],
  cx: number,
  cy: number,
  maxR: number,
  n: number,
): string {
  return values
    .map((pct, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const r = (Math.max(0, Math.min(100, pct)) / 100) * maxR;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");
}

export default function RadarChart({
  scores,
  size = 300,
  showWorldClass = false,
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.34;
  const n = scores.length || 5;

  const angleAt = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const rings = [25, 50, 75, 100];

  const userPoly = polygonPoints(
    scores.map((s) => s.percent),
    cx,
    cy,
    maxR,
    n,
  );
  const smePoly = polygonPoints(
    scores.map((s) => s.smePercent),
    cx,
    cy,
    maxR,
    n,
  );
  const wcPoly = polygonPoints(
    scores.map((s) => s.wcPercent),
    cx,
    cy,
    maxR,
    n,
  );

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={
          showWorldClass
            ? "Radar: Vaša firma vs referencia MSP vs World-class"
            : "Radar: Vaša firma vs referencia MSP"
        }
        className="mx-auto animate-draw-radar"
      >
        {rings.map((r) => (
          <polygon
            key={r}
            fill="none"
            stroke="rgba(148,163,184,0.18)"
            strokeWidth="1"
            points={polygonPoints(
              Array.from({ length: n }, () => r),
              cx,
              cy,
              maxR,
              n,
            )}
          />
        ))}

        {scores.map((_, i) => {
          const a = angleAt(i);
          const x = cx + maxR * Math.cos(a);
          const y = cy + maxR * Math.sin(a);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(148,163,184,0.2)"
              strokeWidth="1"
            />
          );
        })}

        {showWorldClass ? (
          <polygon
            points={wcPoly}
            fill="rgba(34,197,94,0.08)"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeLinejoin="round"
          />
        ) : null}
        <polygon
          points={smePoly}
          fill="rgba(232,165,75,0.1)"
          stroke="#e8a54b"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          strokeLinejoin="round"
        />
        <polygon
          points={userPoly}
          fill="rgba(47,111,237,0.28)"
          stroke="#5b93ff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {scores.map((s, i) => {
          const a = angleAt(i);
          const labelR = maxR + 22;
          const x = cx + labelR * Math.cos(a);
          const y = cy + labelR * Math.sin(a);
          return (
            <text
              key={`label-${s.processId}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#c5d0e0"
              fontSize="11"
              fontFamily="var(--font-sans), sans-serif"
            >
              {domainLabel(s.processId)}
            </text>
          );
        })}
      </svg>

      <ul className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-ink-300">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-4 rounded-sm bg-signal" aria-hidden />
          Vaša firma
        </li>
        <li className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4 border-t-2 border-dashed border-ember"
            aria-hidden
          />
          Referencia MSP
        </li>
        {showWorldClass ? (
          <li className="flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-4 border-t-2 border-dashed border-green-500"
              aria-hidden
            />
            World-class
          </li>
        ) : null}
      </ul>

      <table className="mt-4 w-full max-w-md text-left text-xs text-ink-200">
        <caption className="sr-only">
          Percentá zrelosti po doménach — textová alternatíva k radarovému grafu
        </caption>
        <thead>
          <tr className="border-b border-white/10 text-ink-300">
            <th scope="col" className="py-1.5 pr-2 font-medium">
              Doména
            </th>
            <th scope="col" className="py-1.5 pr-2 font-medium">
              Firma
            </th>
            <th scope="col" className="py-1.5 pr-2 font-medium">
              Ref. MSP
            </th>
            {showWorldClass ? (
              <th scope="col" className="py-1.5 font-medium">
                WC
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {scores.map((s) => (
            <tr key={s.processId} className="border-b border-white/5">
              <th scope="row" className="py-1.5 pr-2 font-normal text-ink-100">
                {domainLabel(s.processId)}
              </th>
              <td className="py-1.5 pr-2">{Math.round(s.percent)}&nbsp;%</td>
              <td className="py-1.5 pr-2">{Math.round(s.smePercent)}&nbsp;%</td>
              {showWorldClass ? (
                <td className="py-1.5">{Math.round(s.wcPercent)}&nbsp;%</td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
