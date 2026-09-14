import type { ExifResponse } from "@/types/api";
import { DataField, Divider } from "@/components/ui";

interface ExifMetadataProps {
  data: ExifResponse;
}

export function ExifMetadata({ data }: ExifMetadataProps) {
  return (
    <div>
      {/* File header */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: "var(--text-dim)",
            marginBottom: "0.5rem",
          }}
        >
          FILE
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.1rem",
            color: "var(--text)",
            letterSpacing: "0.02em",
          }}
        >
          {data.filename}
        </p>
      </div>

      <Divider />

      {/* Device section */}
      {data.device && (data.device.make || data.device.model) && (
        <>
          <Section label="DEVICE">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1.25rem 3rem",
              }}
            >
              <DataField label="Make" value={data.device.make} mono />
              <DataField label="Model" value={data.device.model} mono />
              {data.lens && <DataField label="Lens" value={data.lens} mono />}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* Capture */}
      {(data.datetime || data.software) && (
        <>
          <Section label="CAPTURE">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "1.25rem 3rem",
              }}
            >
              <DataField label="Date / Time" value={data.datetime} mono />
              <DataField label="Software" value={data.software} mono />
              <DataField label="Flash" value={data.flash} mono />
              <DataField label="White Balance" value={data.white_balance} mono />
              <DataField label="Scene Type" value={data.scene_type} mono />
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* Camera settings */}
      {data.camera_settings && (
        <>
          <Section label="CAMERA SETTINGS">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "1.25rem 3rem",
              }}
            >
              <DataField
                label="Focal Length"
                value={
                  data.camera_settings.focal_length != null
                    ? `${data.camera_settings.focal_length} mm`
                    : null
                }
                mono
              />
              <DataField
                label="35mm Equiv."
                value={
                  data.camera_settings.focal_length_35mm != null
                    ? `${data.camera_settings.focal_length_35mm} mm`
                    : null
                }
                mono
              />
              <DataField
                label="Aperture"
                value={
                  data.camera_settings.f_number != null
                    ? `f/${data.camera_settings.f_number}`
                    : null
                }
                mono
              />
              <DataField
                label="Exposure"
                value={
                  data.camera_settings.exposure_time != null
                    ? `${data.camera_settings.exposure_time} s`
                    : null
                }
                mono
              />
              <DataField
                label="ISO"
                value={data.camera_settings.iso}
                mono
              />
              <DataField
                label="Exp. Program"
                value={data.camera_settings.exposure_program}
                mono
              />
              <DataField
                label="Exp. Comp."
                value={
                  data.camera_settings.exposure_compensation != null
                    ? `${data.camera_settings.exposure_compensation} EV`
                    : null
                }
                mono
              />
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* Image dimensions */}
      {data.image && (data.image.width || data.image.height) && (
        <>
          <Section label="IMAGE">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "1.25rem 3rem",
              }}
            >
              <DataField
                label="Dimensions"
                value={
                  data.image.width && data.image.height
                    ? `${data.image.width} × ${data.image.height}`
                    : null
                }
                mono
              />
              <DataField
                label="Color Space"
                value={data.image.color_space != null ? String(data.image.color_space) : null}
                mono
              />
              <DataField
                label="Bits / Sample"
                value={data.image.bits_per_sample != null ? String(data.image.bits_per_sample) : null}
                mono
              />
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* GPS */}
      {data.has_gps && data.gps && (
        <>
          <Section label="GPS COORDINATES">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1.25rem 3rem",
              }}
            >
              <DataField
                label="Latitude"
                value={`${data.gps.lat.toFixed(6)}°`}
                mono
              />
              <DataField
                label="Longitude"
                value={`${data.gps.lon.toFixed(6)}°`}
                mono
              />
              {data.gps.altitude != null && (
                <DataField
                  label="Altitude"
                  value={`${data.gps.altitude} m`}
                  mono
                />
              )}
              <DataField label="Maps Link" mono>
                <a
                  href={`https://www.google.com/maps?q=${data.gps.lat},${data.gps.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    textDecoration: "none",
                  }}
                >
                  {data.gps.lat.toFixed(4)}, {data.gps.lon.toFixed(4)} ↗
                </a>
              </DataField>
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* Attribution */}
      {(data.artist || data.copyright) && (
        <Section label="ATTRIBUTION">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1.25rem 3rem",
            }}
          >
            <DataField label="Artist" value={data.artist} mono />
            <DataField label="Copyright" value={data.copyright} mono />
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          color: "var(--text-dim)",
          marginBottom: "1rem",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
