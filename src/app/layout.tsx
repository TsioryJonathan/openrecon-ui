import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { Header } from "@/components/layout/Header";

// JetBrains Mono — self-hosted via @fontsource-variable/jetbrains-mono
const jetbrainsMono = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s — OpenRecon",
    default: "OpenRecon — Digital intelligence, organized.",
  },
  description:
    "A focused suite of instruments for digital reconnaissance, investigation and evidence discovery.",
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
    <html
      lang="en"
      className={`${GeistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <QueryProvider>
          <Header />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
