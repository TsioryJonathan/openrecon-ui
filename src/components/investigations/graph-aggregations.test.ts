import { describe, expect, it } from "vitest";

import type { RelationItem } from "@/types/api";
import {
  dominantType,
  intraAggregation,
  neighboursOf,
  pairAggregation,
} from "./graph-aggregations";

function rel(over: Partial<RelationItem>): RelationItem {
  return {
    id: "r1",
    source_finding_id: "f1",
    target_finding_id: "f2",
    relation_type: "RESOLVES_TO",
    confidence: "LIKELY",
    reason: "test",
    created_at: "2026-09-01T00:00:00Z",
    source_finding_type: null,
    source_finding_value: null,
    source_finding_target_id: null,
    target_finding_type: null,
    target_finding_value: null,
    target_finding_target_id: null,
    ...over,
  };
}

describe("pairAggregation", () => {
  it("aggregates relations per unordered target pair", () => {
    const pairs = pairAggregation([
      rel({ source_finding_target_id: "t1", target_finding_target_id: "t2" }),
      rel({
        source_finding_target_id: "t2",
        target_finding_target_id: "t1",
        relation_type: "HOSTED_ON",
      }),
    ]);
    expect(pairs.size).toBe(1);
    const agg = pairs.get("t1|t2");
    expect(agg?.count).toBe(2);
    expect(agg?.types.get("RESOLVES_TO")).toBe(1);
    expect(agg?.types.get("HOSTED_ON")).toBe(1);
  });

  it("keeps distinct pairs separate", () => {
    const pairs = pairAggregation([
      rel({ source_finding_target_id: "t1", target_finding_target_id: "t2" }),
      rel({ source_finding_target_id: "t1", target_finding_target_id: "t3" }),
    ]);
    expect(pairs.size).toBe(2);
    expect(pairs.get("t1|t2")?.count).toBe(1);
    expect(pairs.get("t1|t3")?.count).toBe(1);
  });

  it("skips relations with missing or null target ids", () => {
    const pairs = pairAggregation([
      rel({ source_finding_target_id: null, target_finding_target_id: "t2" }),
      rel({ source_finding_target_id: "t1", target_finding_target_id: null }),
    ]);
    expect(pairs.size).toBe(0);
  });

  it("skips intra-target relations (same target both sides)", () => {
    const pairs = pairAggregation([
      rel({ source_finding_target_id: "t1", target_finding_target_id: "t1" }),
    ]);
    expect(pairs.size).toBe(0);
  });

  it("handles an empty list", () => {
    expect(pairAggregation([]).size).toBe(0);
  });
});

describe("intraAggregation", () => {
  it("keeps only relations where both sides are the same target", () => {
    const intra = intraAggregation([
      rel({ source_finding_target_id: "t1", target_finding_target_id: "t1" }),
      rel({ source_finding_target_id: "t1", target_finding_target_id: "t2" }),
    ]);
    expect(intra.size).toBe(1);
    expect(intra.get("t1")?.count).toBe(1);
  });

  it("counts multiple intra relations on one target", () => {
    const intra = intraAggregation([
      rel({
        source_finding_target_id: "t1",
        target_finding_target_id: "t1",
        relation_type: "MENTIONS",
      }),
      rel({
        source_finding_target_id: "t1",
        target_finding_target_id: "t1",
        relation_type: "MENTIONS",
      }),
    ]);
    expect(intra.get("t1")?.count).toBe(2);
    expect(intra.get("t1")?.types.get("MENTIONS")).toBe(2);
  });
});

describe("neighboursOf", () => {
  it("returns the target itself plus direct neighbours", () => {
    const pairs = pairAggregation([
      rel({ source_finding_target_id: "t1", target_finding_target_id: "t2" }),
      rel({ source_finding_target_id: "t2", target_finding_target_id: "t3" }),
    ]);
    const out = neighboursOf(pairs, "t2");
    expect([...out].sort()).toEqual(["t1", "t2", "t3"]);
    expect(neighboursOf(pairs, "t1")).toEqual(new Set(["t1", "t2"]));
  });

  it("returns just the id when isolated", () => {
    expect(neighboursOf(new Map(), "t9")).toEqual(new Set(["t9"]));
  });
});

describe("dominantType", () => {
  it("picks the most frequent relation type", () => {
    const types = new Map([
      ["RESOLVES_TO", 2],
      ["MENTIONS", 5],
      ["HOSTED_ON", 1],
    ]);
    expect(dominantType(types)).toBe("MENTIONS");
  });

  it("returns null for an empty map", () => {
    expect(dominantType(new Map())).toBeNull();
  });
});
