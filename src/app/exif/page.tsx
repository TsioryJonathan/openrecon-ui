import type { Metadata } from "next";
import { ExifTool } from "./ExifTool";

export const metadata: Metadata = {
  title: "EXIF",
  description: "Extract image metadata — device, capture date, GPS coordinates, and more.",
};

export default function ExifPage() {
  return <ExifTool />;
}
