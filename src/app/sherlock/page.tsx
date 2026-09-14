import type { Metadata } from "next";
import { SherlockTool } from "./SherlockTool";

export const metadata: Metadata = {
  title: "Sherlock",
  description: "Username reconnaissance across 480+ platforms.",
};

export default function SherlockPage() {
  return <SherlockTool />;
}
