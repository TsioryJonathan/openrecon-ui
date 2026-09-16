"use client";

import { useState, useEffect } from "react";
import {
  ToolPage,
  RequestError,
  Divider,
  SectionHeader,
  SkeletonLine,
} from "@/components/ui";
import { ExifUpload } from "@/components/exif/ExifUpload";
import { ExifMetadata } from "@/components/exif/ExifMetadata";
import { useExtractExif } from "@/hooks/useApi";
import { IconExif } from "@/lib/icons";

export function ExifTool() {
  const { mutate, isPending, isError, error, data, reset } = useExtractExif();
  const [preview, setPreview]       = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");
  const [fileSize, setFileSize]     = useState<string>("");

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(file: File) {
    reset();

    // Revoke previous preview
    if (preview) URL.revokeObjectURL(preview);

    setPreview(URL.createObjectURL(file));
    setPreviewName(file.name);
    setFileSize(formatSize(file.size));
    mutate({ file });
  }

  const hasFile = preview !== null;

  return (
    <ToolPage
      eyebrow="EXIF / FORENSICS"
      title="Metadata extraction"
      description="Analyse image files to extract device, capture settings, GPS coordinates and embedded metadata."
      icon={<IconExif size={20} />}
    >
      {/* ── Upload + preview ── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: hasFile ? "auto 1fr" : "1fr",
          gap:                 "2rem",
          alignItems:          "start",
          maxWidth:            hasFile ? "none" : "420px",
        }}
      >
        {/* Upload zone */}
        <ExifUpload
          onFile={handleFile}
          loading={isPending}
          hasFile={hasFile}
        />

        {/* Preview — only shown when file loaded */}
        {hasFile && preview && (
          <div>
            <p className="t-label" style={{ marginBottom: "0.625rem" }}>PREVIEW</p>
            <div
              style={{
                border:     "1px solid var(--border-subtle)",
                background: "var(--surface)",
                overflow:   "hidden",
                maxWidth:   "400px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={`Preview of ${previewName}`}
                style={{
                  display:   "block",
                  width:     "100%",
                  maxHeight: "280px",
                  objectFit: "contain",
                  background: "var(--surface)",
                }}
              />
            </div>
            <div
              style={{
                marginTop:  "0.5rem",
                display:    "flex",
                gap:        "0.75rem",
                alignItems: "baseline",
              }}
            >
              <p
                className="t-mono"
                style={{
                  fontSize:     "var(--text-xs)",
                  color:        "var(--text-muted)",
                  overflow:     "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace:   "nowrap",
                  maxWidth:     "280px",
                }}
              >
                {previewName}
              </p>
              {fileSize && (
                <p className="t-label" style={{ color: "var(--text-dim)", flexShrink: 0 }}>
                  {fileSize}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Results / states ── */}
      {(isPending || data || isError) && (
        <>
          <Divider style={{ margin: "2rem 0" }} />

          {isPending && <ExifSkeleton />}

          {isError && !isPending && (
            <RequestError
              message={
                (error as { detail?: string })?.detail ??
                "Failed to extract metadata from this file."
              }
            />
          )}

          {!isPending && data && <ExifMetadata data={data} />}
        </>
      )}
    </ToolPage>
  );
}

// ─── ExifSkeleton ─────────────────────────────────────────────────────────────

function ExifSkeleton() {
  return (
    <div aria-label="Extracting metadata" aria-busy="true">

      {/* File block */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          className="t-label animate-scan-pulse"
          style={{ color: "var(--accent)", marginBottom: "0.75rem" }}
        >
          EXTRACTING METADATA
        </p>
        <SkeletonLine width="220px" height="22px" />
      </div>

      <Divider />

      {/* Device block */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionHeader label="DEVICE" />
        <SkeletonLine width="60px"  height="10px" />
        <div style={{ marginTop: "0.4rem", marginBottom: "1.25rem" }}>
          <SkeletonLine width="180px" height="26px" />
        </div>
        <SkeletonLine width="120px" height="12px" />
      </div>

      <Divider />

      {/* Camera block */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionHeader label="CAMERA" />
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap:                 "1.25rem 2.5rem",
          }}
        >
          {["Focal Length", "Aperture", "Exposure", "ISO", "Program"].map((l) => (
            <div key={l}>
              <p className="t-label" style={{ marginBottom: "0.3rem" }}>{l}</p>
              <SkeletonLine width="70px" height="13px" />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Capture block */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionHeader label="CAPTURE" />
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap:                 "1.25rem 2.5rem",
          }}
        >
          {["Date / Time", "Flash", "White Balance"].map((l) => (
            <div key={l}>
              <p className="t-label" style={{ marginBottom: "0.3rem" }}>{l}</p>
              <SkeletonLine width="100px" height="13px" />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Location block */}
      <div>
        <SectionHeader label="LOCATION" />
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:                 "1.5rem 2rem",
            maxWidth:            "380px",
            marginBottom:        "1.25rem",
          }}
        >
          {["LATITUDE", "LONGITUDE"].map((l) => (
            <div key={l}>
              <p className="t-label" style={{ marginBottom: "0.4rem" }}>{l}</p>
              <SkeletonLine width="110px" height="26px" />
            </div>
          ))}
        </div>
        <SkeletonLine width="140px" height="30px" />
      </div>
    </div>
  );
}

// ─── formatSize ───────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
