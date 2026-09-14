import type { Metadata } from "next";
import { SherlockHistoryTool } from "./SherlockHistoryTool";

export const metadata: Metadata = {
  title: "Sherlock / History",
  description: "Past Sherlock reconnaissance searches.",
};

export default function SherlockHistoryPage() {
  return <SherlockHistoryTool />;
}
