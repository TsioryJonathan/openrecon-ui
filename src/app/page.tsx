import Link from "next/link";
import {
  IconSherlock,
  IconRecon,
  IconExif,
  IconDorks,
  IconArrow,
} from "@/lib/icons";

// ─── Instrument index data ────────────────────────────────────────────────────

const INSTRUMENTS = [
  {
    index:       "01",
    id:          "SHERLOCK",
    href:        "/sherlock",
    Icon:        IconSherlock,
    label:       "USERNAME RECONNAISSANCE",
    description: "Scan 480+ platforms and surface every account tied to an identity.",
  },
  {
    index:       "02",
    id:          "RECON",
    href:        "/recon",
    Icon:        IconRecon,
    label:       "NETWORK INTELLIGENCE",
    description: "Geolocate IPs, map ASNs, resolve DNS records and enumerate subdomains.",
  },
  {
    index:       "03",
    id:          "EXIF",
    href:        "/exif",
    Icon:        IconExif,
    label:       "METADATA FORENSICS",
    description: "Extract device, GPS, capture settings and attribution from image files.",
  },
  {
    index:       "04",
    id:          "DORKS",
    href:        "/dorks",
    Icon:        IconDorks,
    label:       "SEARCH INTELLIGENCE",
    description: "Generate targeted search operators to surface exposed assets and data.",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position:       "relative",
          minHeight:      "100vh",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "flex-end",
          overflow:       "hidden",
        }}
      >

        {/* Background: satellite image */}
        <div
          aria-hidden="true"
          style={{
            position:           "absolute",
            inset:              0,
            backgroundImage:    "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
            backgroundSize:     "cover",
            backgroundPosition: "center 25%",
            opacity:            0.12,
          }}
        />

        {/* Gradient: dark vignette, heavier at bottom */}
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(160deg, var(--bg) 0%, transparent 40%, var(--bg) 85%)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(to top, var(--bg) 0%, transparent 50%)",
          }}
        />

        {/* Subtle noise grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset:    0,
            opacity:  0.025,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize:   "128px",
          }}
        />

        {/* Content — anchored to bottom */}
        <div
          style={{
            position: "relative",
            maxWidth: "72rem",
            margin:   "0 auto",
            padding:  "0 2rem 5rem",
            width:    "100%",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           "1rem",
              marginBottom:  "2.5rem",
            }}
          >
            <p
              className="t-label"
              style={{ color: "var(--accent)", letterSpacing: "0.16em" }}
            >
              OSINT TOOLKIT
            </p>
            <span
              className="t-label"
              style={{ color: "var(--border)", letterSpacing: 0 }}
            >
              /
            </span>
            <p
              className="t-label"
              style={{ color: "var(--text-dim)", letterSpacing: "0.12em" }}
            >
              04 INSTRUMENTS
            </p>
          </div>

          {/* Headline */}
          <h1
            style={{
              marginBottom: "1.75rem",
              maxWidth:     "16ch",
            }}
          >
            {/* "Digital intelligence," — display font */}
            <span
              style={{
                display:       "block",
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(2.5rem, 7vw, 5.5rem)",
                fontWeight:    700,
                letterSpacing: "-0.03em",
                lineHeight:    1.0,
                color:         "var(--text)",
              }}
            >
              Digital intelligence,
            </span>
            {/* "organized." — Fraunces italic accent */}
            <span
              style={{
                display:    "block",
                fontFamily: "var(--font-editorial)",
                fontSize:   "clamp(2.5rem, 7vw, 5.5rem)",
                fontWeight: 400,
                fontStyle:  "italic",
                lineHeight: 1.05,
                color:      "var(--accent)",
              }}
            >
              organized.
            </span>
          </h1>

          {/* Subhead */}
          <p
            style={{
              fontFamily:   "var(--font-body)",
              color:        "var(--text-muted)",
              fontSize:     "var(--text-base)",
              lineHeight:   1.7,
              maxWidth:     "46ch",
              marginBottom: "2.75rem",
            }}
          >
            A focused suite for digital reconnaissance,
            investigation and evidence discovery.
          </p>

          {/* CTA */}
          <Link
            href="/sherlock"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "0.5rem",
              fontFamily:    "var(--font-mono)",
              fontSize:      "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         "var(--accent)",
              borderBottom:  "1px solid currentColor",
              paddingBottom: "2px",
              transition:    "opacity var(--t-base)",
            }}
            className="hover:opacity-60"
          >
            Explore tools
            <IconArrow size={13} />
          </Link>
        </div>
      </section>

      {/* ── Instrument index ─────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "72rem",
          margin:   "0 auto",
          padding:  "0 2rem 7rem",
        }}
        aria-label="Available instruments"
      >
        {/* Section label */}
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "1rem",
            marginBottom:  "0",
            paddingBottom: "1.25rem",
            borderBottom:  "1px solid var(--border-subtle)",
          }}
        >
          <p className="t-label" style={{ color: "var(--text-dim)" }}>
            INSTRUMENTS
          </p>
          <p className="t-label" style={{ color: "var(--border)" }}>
            04
          </p>
        </div>

        {/* Index list */}
        <ol style={{ listStyle: "none" }}>
          {INSTRUMENTS.map(({ index, id, href, Icon, label, description }) => (
            <li key={id}>
              <Link
                href={href}
                style={{
                  display:        "grid",
                  gridTemplateColumns: "3rem 1.75rem 1fr auto",
                  alignItems:     "center",
                  gap:            "1.25rem",
                  padding:        "1.5rem 0",
                  borderBottom:   "1px solid var(--border-subtle)",
                  textDecoration: "none",
                  transition:     "background var(--t-base)",
                }}
                className="group"
                aria-label={`${id} — ${label}`}
              >
                {/* Index number */}
                <span
                  className="t-mono"
                  style={{
                    fontSize:      "var(--text-2xs)",
                    letterSpacing: "0.1em",
                    color:         "var(--text-dim)",
                    transition:    "color var(--t-base)",
                    lineHeight:    1,
                  }}
                >
                  {index}
                </span>

                {/* Icon */}
                <span
                  style={{
                    color:      "var(--text-dim)",
                    transition: "color var(--t-base)",
                    display:    "flex",
                    alignItems: "center",
                  }}
                  className="group-hover:text-[var(--accent)]"
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </span>

                {/* Label + description */}
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily:    "var(--font-display)",
                      fontSize:      "var(--text-sm)",
                      fontWeight:    600,
                      letterSpacing: "0.04em",
                      color:         "var(--text-muted)",
                      marginBottom:  "0.2rem",
                      transition:    "color var(--t-base)",
                    }}
                    className="group-hover:text-[var(--text)]"
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize:   "var(--text-sm)",
                      color:      "var(--text-dim)",
                      lineHeight: 1.5,
                      transition: "color var(--t-base)",
                    }}
                    className="group-hover:text-[var(--text-muted)]"
                  >
                    {description}
                  </p>
                </div>

                {/* Arrow */}
                <span
                  style={{
                    color:      "var(--text-dim)",
                    opacity:    0,
                    transition: "opacity var(--t-base), transform var(--t-base)",
                    display:    "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    transform:  "translateX(-4px)",
                  }}
                  className="group-hover:opacity-100 group-hover:translate-x-0"
                  aria-hidden="true"
                >
                  <IconArrow size={14} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

    </div>
  );
}
