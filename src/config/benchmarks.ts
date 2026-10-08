/**
 * Benchmark source metadata for UI copy.
 * Actual numeric benchmarks remain in `src/lib/audit/benchmarks.ts`.
 * TODO(owner): confirm source classification / citations when published.
 */

export type BenchmarkSource =
  | { kind: "expert-estimate" }
  | { kind: "published"; citation: string };

export const BENCHMARK_SOURCE: BenchmarkSource = {
  kind: "expert-estimate",
};

export function benchmarkSourceNoteSk(): string {
  if (BENCHMARK_SOURCE.kind === "published") {
    return `Zdroj referencie: ${BENCHMARK_SOURCE.citation}.`;
  }
  return "Referenčné hodnoty MSP sú interné referencie AVENG založené na expertnom odhade, nie oficiálna štatistika.";
}
