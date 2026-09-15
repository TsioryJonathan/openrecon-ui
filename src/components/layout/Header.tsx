"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  IconSherlock,
  IconRecon,
  IconExif,
  IconDorks,
  IconClose,
  IconMenu,
} from "@/lib/icons";

// ─── Nav items with icons and descriptions ────────────────────────────────────

const NAV_ITEMS = [
  {
    label:       "Sherlock",
    href:        "/sherlock",
    Icon:        IconSherlock,
    description: "Username reconnaissance",
    index:       "01",
  },
  {
    label:       "Recon",
    href:        "/recon",
    Icon:        IconRecon,
    description: "Network intelligence",
    index:       "02",
  },
  {
    label:       "EXIF",
    href:        "/exif",
    Icon:        IconExif,
    description: "Metadata forensics",
    index:       "03",
  },
  {
    label:       "Dorks",
    href:        "/dorks",
    Icon:        IconDorks,
    description: "Search intelligence",
    index:       "04",
  },
] as const;

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Slightly increase border opacity when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        style={{
          position:         "fixed",
          top:              0,
          left:             0,
          right:            0,
          zIndex:           50,
          background:       "rgba(9,9,11,0.88)",
          backdropFilter:   "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom:     scrolled
            ? "1px solid var(--border-subtle)"
            : "1px solid transparent",
          transition:       "border-color 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth:       "72rem",
            margin:         "0 auto",
            padding:        "0 2rem",
            height:         "56px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label="OpenRecon - home"
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "0.625rem",
              flexShrink: 0,
            }}
          >
            <Image
              src="/logos/logo-hero.png"
              alt="OpenRecon"
              width={120}
              height={40}
              style={{ height: "28px", width: "auto" }}
              priority
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            style={{ display: "flex", alignItems: "center", gap: "0.125rem" }}
            className="hidden md:flex"
          >
            {NAV_ITEMS.map(({ label, href, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display:       "flex",
                    alignItems:    "center",
                    gap:           "0.4rem",
                    padding:       "0.4rem 0.75rem",
                    fontFamily:    "var(--font-display)",
                    fontSize:      "0.75rem",
                    fontWeight:    active ? 600 : 500,
                    letterSpacing: "0.01em",
                    color:         active ? "var(--accent)" : "var(--text-muted)",
                    position:      "relative",
                    transition:    "color 0.15s ease",
                    textDecoration: "none",
                  }}
                  className="group hover:text-[var(--text)]"
                  aria-current={active ? "page" : undefined}
                >
                  {/* Active indicator dot */}
                  {active && (
                    <span
                      style={{
                        width:        "4px",
                        height:       "4px",
                        borderRadius: "50%",
                        background:   "var(--accent)",
                        flexShrink:   0,
                        marginRight:  "0.1rem",
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    size={13}
                    style={{
                      opacity:    active ? 1 : 0.6,
                      transition: "opacity 0.15s ease",
                      flexShrink: 0,
                    }}
                  />
                  {label}
                  {/* Bottom border on active */}
                  {active && (
                    <span
                      style={{
                        position:   "absolute",
                        bottom:     0,
                        left:       "0.75rem",
                        right:      "0.75rem",
                        height:     "1px",
                        background: "var(--accent)",
                        opacity:    0.6,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            style={{
              display:    "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border:     "none",
              color:      "var(--text-muted)",
              padding:    "0.375rem",
              cursor:     "pointer",
              transition: "color 0.15s ease",
            }}
            className="md:hidden hover:text-[var(--text)]"
          >
            {mobileOpen ? <IconClose size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </header>

      {/* ── Mobile nav overlay ── */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-label="Navigation"
          aria-modal="true"
          style={{
            position:   "fixed",
            inset:      0,
            zIndex:     49,
            top:        "56px",
            background: "var(--bg)",
            padding:    "0 2rem 2rem",
            overflowY:  "auto",
          }}
          className="md:hidden animate-fade-in"
        >
          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", marginBottom: "0.5rem" }} />

          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map(({ label, href, Icon, description, index }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display:        "grid",
                    gridTemplateColumns: "2.5rem 1fr auto",
                    alignItems:     "center",
                    gap:            "1rem",
                    padding:        "1.125rem 0",
                    borderBottom:   "1px solid var(--border-subtle)",
                    textDecoration: "none",
                    transition:     "background 0.12s ease",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {/* Index */}
                  <span
                    style={{
                      fontFamily:    "var(--font-mono)",
                      fontSize:      "0.625rem",
                      letterSpacing: "0.1em",
                      color:         active ? "var(--accent)" : "var(--text-dim)",
                    }}
                  >
                    {index}
                  </span>

                  {/* Label + description */}
                  <div>
                    <p
                      style={{
                        fontFamily:    "var(--font-display)",
                        fontSize:      "0.9375rem",
                        fontWeight:    active ? 600 : 500,
                        color:         active ? "var(--accent)" : "var(--text)",
                        letterSpacing: "-0.01em",
                        marginBottom:  "0.2rem",
                      }}
                    >
                      {label.toUpperCase()}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize:   "0.75rem",
                        color:      "var(--text-dim)",
                      }}
                    >
                      {description}
                    </p>
                  </div>

                  {/* Icon */}
                  <Icon
                    size={16}
                    style={{
                      color:   active ? "var(--accent)" : "var(--text-dim)",
                      opacity: active ? 1 : 0.5,
                    }}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

