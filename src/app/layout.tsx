import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: {
    template: "%s — OpenRecon",
    default: "OpenRecon — Digital intelligence, organized.",
  },
  description:
    "A suite of instruments for digital reconnaissance. Username scanning, IP/domain intelligence, EXIF metadata extraction, and search operators.",
  openGraph: {
    title: "OpenRecon",
    description: "Digital intelligence, organized.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <QueryProvider>
          <Header />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
