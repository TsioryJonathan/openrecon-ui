import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenRecon",
  description: "OSINT username reconnaissance across 480+ platforms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
