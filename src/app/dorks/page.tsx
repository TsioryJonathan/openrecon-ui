import type { Metadata } from "next";
import { DorksTool } from "./DorksTool";

export const metadata: Metadata = {
  title: "Dorks",
  description: "Generate targeted Google dork queries for OSINT intelligence gathering.",
};

export default function DorksPage() {
  return <DorksTool />;
}
