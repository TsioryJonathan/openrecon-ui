import type { Metadata } from "next";
import { InvestigationsTool } from "./InvestigationsTool";

export const metadata: Metadata = {
  title: "Investigations",
  description:
    "Multi-target OSINT investigations with correlation and adaptive scanning.",
};

export default function InvestigationsPage() {
  return <InvestigationsTool />;
}
