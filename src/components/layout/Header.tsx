"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Sherlock", href: "/sherlock" },
  { label: "Recon", href: "/recon" },
  { label: "EXIF", href: "/exif" },
  { label: "Dorks", href: "/dorks" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(9,9,11,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="OpenRecon home"
        >
          <OpenReconLogo />
          <span
            style={{ color: "var(--text)", letterSpacing: "0.08em" }}
            className="text-sm font-medium uppercase hidden sm:block"
          >
            OpenRecon
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                color: isActive(href) ? "var(--accent)" : "var(--text-muted)",
                borderBottom: isActive(href)
                  ? "1px solid var(--accent)"
                  : "1px solid transparent",
                paddingBottom: "1px",
              }}
              className="px-3 py-1.5 text-sm tracking-wide transition-colors hover:text-[var(--text)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          style={{ borderTop: "1px solid var(--border-subtle)" }}
          className="md:hidden bg-[var(--bg)] px-5 py-3"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: isActive(href) ? "var(--accent)" : "var(--text-muted)",
              }}
              className="block py-3 text-sm tracking-wide border-b border-[var(--border-subtle)] last:border-0 hover:text-[var(--text)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function OpenReconLogo() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8.5" stroke="var(--accent)" strokeWidth="1.2" />
      <circle cx="11" cy="11" r="3.5" stroke="var(--accent)" strokeWidth="1.2" />
      <line
        x1="11"
        y1="2.5"
        x2="11"
        y2="5"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="17"
        x2="11"
        y2="19.5"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="2.5"
        y1="11"
        x2="5"
        y2="11"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="11"
        x2="19.5"
        y2="11"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
