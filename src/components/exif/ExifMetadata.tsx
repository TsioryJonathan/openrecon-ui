"use client";

import type { ExifResponse } from "@/types/api";
import { Divider, SectionHeader, CopyButton } from "@/components/ui";
import {
  IconDevice,
  IconCamera,
  IconTime,
  IconLocation,
  IconFile,
} from "@/lib/icons";

interface ExifMetadataProps {
  data: ExifResponse;
}

export function ExifMetadata({ data }: ExifMetadataProps) {
  // Determine which sections have real data
  const hasDevice   = !!(data.device?.make || data.device?.model || data.lens);
  const hasCapture  = !!(data.datetime || data.flash || data.white_balance || data.scene_type);
  const hasCamera   = !!data.camera_settings && Object.values(data.camera_settings).some((v) => v != null);
  const hasImage    = !!(data.image?.width || data.image?.height);
  const hasGps      = !!(data.has_gps && data.gps);
  const hasSoftware = !!(data.software || data.artist || data.copyright);

  return (
    <div className="animate-fade-in">

      {/* ── File block ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <IconFile size={13} style={{ color: "var(--text-dim)" }} aria-hidden="true" />
          <p className="t-label">FILE</p>
        </div>
        <div
          style={{
            display:    "flex",
            alignItems: "baseline",
            gap:        "0.75rem",
            flexWrap:   "wrap",
          }}
        >
          <p
            className="t-mono"
            style={{
              fontSize:      "var(--text-lg)",
              color:         "var(--text)",
              letterSpacing: "0.02em",
              lineHeight:    1,
            }}
          >
            {data.filename}
          </p>
          <CopyButton text={data.filename} label="Copy filename" size={13} />
        </div>
      </div>

      <Divider />

      {/* ── Device ── */}
      {hasDevice && (
        <>
          <section aria-label="Device information" style={{ marginBottom: "2rem" }}>
            <SectionHeader label="DEVICE" icon={<IconDevice size={13} />} />

            {/* Make + model prominent */}
            {(data.device?.make || data.device?.model) && (
              <div style={{ marginBottom: "1.25rem" }}>
                {data.device?.make && (
                  <p
                    className="t-label"
                    style={{ color: "var(--text-dim)", marginBottom: "0.3rem" }}
                  >
                    {data.device.make.toUpperCase()}
                  </p>
                )}
                {data.device?.model && (
                  <p
                    style={{
                      fontFamily:    "var(--font-display)",
                      fontSize:      "var(--text-xl)",
                      fontWeight:    600,
                      color:         "var(--text)",
                      letterSpacing: "-0.02em",
                      lineHeight:    1.1,
                    }}
                  >
                    {data.device.model}
                  </p>
                )}
              </div>
            )}

            {data.lens && (
              <MetaField label="Lens" value={data.lens} mono />
            )}
          </section>
          <Divider />
        </>
      )}

      {/* ── Camera settings ── */}
      {hasCamera && (
        <>
          <section aria-label="Camera settings" style={{ marginBottom: "2rem" }}>
            <SectionHeader label="CAMERA" icon={<IconCamera size={13} />} />
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap:                 "1.25rem 2.5rem",
              }}
            >
              {data.camera_settings?.focal_length != null && (
                <MetaField
                  label="Focal Length"
                  value={`${data.camera_settings.focal_length} mm`}
                  mono
                />
              )}
              {data.camera_settings?.focal_length_35mm != null && (
                <MetaField
                  label="35mm Equiv."
                  value={`${data.camera_settings.focal_length_35mm} mm`}
                  mono
                />
              )}
              {data.camera_settings?.f_number != null && (
                <MetaField
                  label="Aperture"
                  value={`f/${data.camera_settings.f_number}`}
                  mono
                />
              )}
              {data.camera_settings?.exposure_time != null && (
                <MetaField
                  label="Exposure"
                  value={`${data.camera_settings.exposure_time} s`}
                  mono
                />
              )}
              {data.camera_settings?.iso != null && (
                <MetaField
                  label="ISO"
                  value={String(data.camera_settings.iso)}
                  mono
                />
              )}
              {data.camera_settings?.exposure_program && (
                <MetaField
                  label="Program"
                  value={data.camera_settings.exposure_program}
                  mono
                />
              )}
              {data.camera_settings?.exposure_compensation != null && (
                <MetaField
                  label="Exp. Comp."
                  value={`${data.camera_settings.exposure_compensation} EV`}
                  mono
                />
              )}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ── Capture ── */}
      {hasCapture && (
        <>
          <section aria-label="Capture information" style={{ marginBottom: "2rem" }}>
            <SectionHeader label="CAPTURE" icon={<IconTime size={13} />} />
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap:                 "1.25rem 2.5rem",
              }}
            >
              {data.datetime && (
                <MetaField label="Date / Time" value={data.datetime} mono />
              )}
              {data.flash && (
                <MetaField label="Flash" value={data.flash} mono />
              )}
              {data.white_balance && (
                <MetaField label="White Balance" value={data.white_balance} mono />
              )}
              {data.scene_type && (
                <MetaField label="Scene Type" value={data.scene_type} mono />
              )}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ── Image technical ── */}
      {hasImage && (
        <>
          <section aria-label="Image technical details" style={{ marginBottom: "2rem" }}>
            <SectionHeader label="TECHNICAL" />
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap:                 "1.25rem 2.5rem",
              }}
            >
              {(data.image?.width && data.image?.height) && (
                <MetaField
                  label="Dimensions"
                  value={`${data.image.width} × ${data.image.height}`}
                  mono
                />
              )}
              {data.image?.color_space != null && (
                <MetaField
                  label="Color Space"
                  value={String(data.image.color_space)}
                  mono
                />
              )}
              {data.image?.bits_per_sample != null && (
                <MetaField
                  label="Bits / Sample"
                  value={String(data.image.bits_per_sample)}
                  mono
                />
              )}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ── GPS — visually prominent ── */}
      {hasGps && data.gps && (
        <>
          <section aria-label="GPS location" style={{ marginBottom: "2rem" }}>
            <SectionHeader label="LOCATION" icon={<IconLocation size={13} />} />

            {/* Coordinates in large mono */}
            <div
              style={{
                display:      "grid",
                gridTemplateColumns: "1fr 1fr",
                gap:          "1.5rem 2rem",
                marginBottom: "1.5rem",
                maxWidth:     "380px",
              }}
            >
              <div>
                <p className="t-label" style={{ marginBottom: "0.4rem" }}>LATITUDE</p>
                <p
                  className="t-mono"
                  style={{
                    fontSize:      "var(--text-xl)",
                    color:         "var(--text)",
                    letterSpacing: "0.02em",
                    lineHeight:    1,
                  }}
                >
                  {data.gps.lat.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="t-label" style={{ marginBottom: "0.4rem" }}>LONGITUDE</p>
                <p
                  className="t-mono"
                  style={{
                    fontSize:      "var(--text-xl)",
                    color:         "var(--text)",
                    letterSpacing: "0.02em",
                    lineHeight:    1,
                  }}
                >
                  {data.gps.lon.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Altitude if available */}
            {data.gps.altitude != null && (
              <div style={{ marginBottom: "1.25rem" }}>
                <MetaField
                  label="Altitude"
                  value={`${data.gps.altitude} m`}
                  mono
                />
              </div>
            )}

            {/* Open location CTA */}
            <a
              href={`https://www.google.com/maps?q=${data.gps.lat},${data.gps.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GPS coordinates in Google Maps (opens in new tab)"
              style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "0.4rem",
                fontFamily:    "var(--font-mono)",
                fontSize:      "var(--text-xs)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         "var(--accent)",
                border:        "1px solid var(--accent)",
                padding:       "0.4rem 0.875rem",
                background:    "var(--accent-dim)",
                transition:    "opacity var(--t-base)",
                textDecoration: "none",
              }}
              className="hover:opacity-70"
            >
              <IconLocation size={11} aria-hidden="true" />
              Open location ↗
            </a>
          </section>
          <Divider />
        </>
      )}

      {/* ── Software / Attribution ── */}
      {hasSoftware && (
        <section aria-label="Software and attribution">
          <SectionHeader label="SOFTWARE & ATTRIBUTION" />
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap:                 "1.25rem 2.5rem",
            }}
          >
            {data.software  && <MetaField label="Software"  value={data.software}  mono />}
            {data.artist    && <MetaField label="Artist"    value={data.artist}    mono />}
            {data.copyright && <MetaField label="Copyright" value={data.copyright} mono />}
          </div>
        </section>
      )}

      {/* Empty — no useful metadata found */}
      {!hasDevice && !hasCamera && !hasCapture && !hasImage && !hasGps && !hasSoftware && (
        <div style={{ padding: "1.5rem 0" }}>
          <p className="t-label" style={{ marginBottom: "0.4rem" }}>NO METADATA</p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   "var(--text-sm)",
              color:      "var(--text-muted)",
            }}
          >
            No EXIF metadata was found in this file. The image may have been
            stripped or generated programmatically.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── MetaField ────────────────────────────────────────────────────────────────

function MetaField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="t-label" style={{ marginBottom: "0.3rem" }}>{label}</p>
      <p
        className={mono ? "t-mono" : undefined}
        style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
          fontSize:   mono ? "var(--text-sm)" : "var(--text-base)",
          color:      "var(--text)",
          lineHeight: 1.45,
          wordBreak:  "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}
