import type { RelationItem } from "@/types/api";

/**
 * Pure aggregation helpers for the investigation graph.
 *
 * Kept free of React / @xyflow imports so they can be unit-tested directly.
 */

export type PairAgg = { count: number; types: Map<string, number> };

export function dominantType(types: Map<string, number>): string | null {
  let best: string | null = null;
  let bestN = 0;
  types.forEach((n, t) => {
    if (n > bestN) {
      bestN = n;
      best = t;
    }
  });
  return best;
}

function bump(pair: Map<string, PairAgg>, key: string, r: RelationItem) {
  const agg = pair.get(key) ?? { count: 0, types: new Map<string, number>() };
  agg.count += 1;
  if (r.relation_type) {
    agg.types.set(r.relation_type, (agg.types.get(r.relation_type) ?? 0) + 1);
  }
  pair.set(key, agg);
}

/** Aggregate inter-target relations per unordered target pair. */
export function pairAggregation(relations: RelationItem[]) {
  const pair = new Map<string, PairAgg>();
  for (const r of relations) {
    const a = r.source_finding_target_id;
    const b = r.target_finding_target_id;
    if (!a || !b || a === b) continue;
    bump(pair, a < b ? a + "|" + b : b + "|" + a, r);
  }
  return pair;
}

/** Aggregate intra-target relations (both sides resolve to the same target). */
export function intraAggregation(relations: RelationItem[]) {
  const pair = new Map<string, PairAgg>();
  for (const r of relations) {
    const a = r.source_finding_target_id;
    const b = r.target_finding_target_id;
    if (!a || !b || a !== b) continue;
    bump(pair, a, r);
  }
  return pair;
}

/** Target ids reachable from `id` (including itself) via aggregated pairs. */
export function neighboursOf(pairs: Map<string, PairAgg>, id: string) {
  const out = new Set<string>([id]);
  pairs.forEach((_agg, key) => {
    const parts = key.split("|");
    if (parts[0] === id) out.add(parts[1]);
    else if (parts[1] === id) out.add(parts[0]);
  });
  return out;
}
