import type { Metadata } from "next";
import { ReconTool } from "./ReconTool";

export const metadata: Metadata = {
  title: "Recon",
  description: "IP address and domain intelligence — geolocation, ASN, DNS, subdomains.",
};

export default function ReconPage() {
  return <ReconTool />;
}
