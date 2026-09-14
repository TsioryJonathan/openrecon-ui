import Link from "next/link";
import { ArrowRight } from "lucide-react";

const INSTRUMENTS = [
  {
    id: "SHERLOCK",
    href: "/sherlock",
    label: "Username reconnaissance",
    description: "Scan 480+ platforms for a username in seconds.",
  },
  {
    id: "RECON",
    href: "/recon",
    label: "IP & domain intelligence",
    description: "Geolocation, ASN, DNS records, subdomains.",
  },
  {
    id: "EXIF",
    href: "/exif",
    label: "Metadata extraction",
    description: "Forensic analysis of image EXIF data, GPS, device.",
  },
  {
    id: "DORKS",
    href: "/dorks",
    label: "Search intelligence",
    description: "Generate targeted Google dork queries.",
  },
] as const;

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background image + overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.18,
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, var(--bg) 0%, transparent 30%, transparent 70%, var(--bg) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, transparent 40%, var(--bg) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "7rem 2rem 4rem",
            width: "100%",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              color: "var(--accent)",
              marginBottom: "2rem",
            }}
          >
            OSINT TOOLKIT
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              lineHeight: 1.02,
              fontWeight: 400,
              marginBottom: "1.5rem",
              maxWidth: "14ch",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--text)",
                display: "block",
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              Digital intelligence,
            </span>
            <span
              style={{
                fontFamily: "var(--font-editorial)",
                color: "var(--accent)",
                display: "block",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              organized.
            </span>
          </h1>

          {/* Subhead */}
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.65,
              maxWidth: "42ch",
              marginBottom: "3rem",
            }}
          >
            A suite of instruments for digital reconnaissance.
            <br />
            Find what others can&apos;t.
          </p>

          {/* CTA */}
          <Link
            href="/sherlock"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--accent)",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 500,
              borderBottom: "1px solid var(--accent)",
              paddingBottom: "2px",
              transition: "opacity 0.15s",
            }}
            className="hover:opacity-70"
          >
            Explore tools
            <ArrowRight size={14} />
          </Link>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "3rem",
              marginTop: "5rem",
              flexWrap: "wrap",
            }}
          >
            {[
              ["480+", "Platforms"],
              ["IP / Domain", "Recon"],
              ["Image Metadata", "EXIF"],
              ["Search Operators", "Dorks"],
            ].map(([val, label]) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text)",
                    letterSpacing: "0.06em",
                    marginBottom: "0.2rem",
                  }}
                >
                  {val}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--text-dim)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instruments grid */}
      <section
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "6rem 2rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            color: "var(--text-dim)",
            marginBottom: "3rem",
          }}
        >
          INSTRUMENTS
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0",
          }}
        >
          {INSTRUMENTS.map(({ id, href, label, description }, i) => (
            <Link
              key={id}
              href={href}
              style={{
                display: "block",
                padding: "2rem",
                borderTop: "1px solid var(--border-subtle)",
                borderRight:
                  i % 2 === 0 ? "1px solid var(--border-subtle)" : "none",
                transition: "background 0.15s",
                textDecoration: "none",
              }}
              className="hover:bg-[var(--surface)] group"
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.14em",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                }}
              >
                {id}
              </p>
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                {description}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "var(--text-dim)",
                  transition: "color 0.15s",
                }}
                className="group-hover:text-[var(--accent)]"
              >
                OPEN
                <ArrowRight size={10} />
              </span>
            </Link>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
      </section>
    </div>
  );
}
