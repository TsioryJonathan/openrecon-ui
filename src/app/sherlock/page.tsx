import type { Metadata } from "next";

import { getTotalPlatforms, platformCountLabel } from "@/lib/platforms";
import { SherlockTool } from "./SherlockTool";

export async function generateMetadata(): Promise<Metadata> {
  const count = platformCountLabel(await getTotalPlatforms());
  return {
    title: "Sherlock",
    description: `Username reconnaissance across ${count}.`,
  };
}

export default function SherlockPage() {
  return <SherlockTool />;
}
