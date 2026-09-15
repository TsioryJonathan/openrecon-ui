"use client";

import { useState } from "react";
import Image from "next/image";
import { ToolPage, RequestError, Divider } from "@/components/ui";
import { ExifUpload } from "@/components/exif/ExifUpload";
import { ExifMetadata } from "@/components/exif/ExifMetadata";
import { useExtractExif } from "@/hooks/useApi";

export function ExifTool() {
  const { mutate, isPending, isError, error, data, reset } = useExtractExif();
  const [preview, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");

  function handleFile(file: File) {
    reset();
    // Create preview URL
    const url = URL.createObjectURL(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(url);
    setPreviewName(file.name);
    mutate({ file });
  }

  return (
    <ToolPage
      eyebrow="EXIF"
      title="Metadata extraction"
      description="Analyse image files to extract device information, GPS coordinates, capture settings, and embedded metadata."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: preview ? "1fr 1fr" : "1fr",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* Upload */}
        <div>
          <ExifUpload onFile={handleFile} loading={isPending} />
        </div>

        {/* Preview */}
        {preview && (
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: "var(--text-dim)",
                marginBottom: "0.75rem",
              }}
            >
              PREVIEW
            </p>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4/3",
                background: "var(--surface)",
                border: "1px solid var(--border-subtle)",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={`Preview of ${previewName}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-dim)",
                marginTop: "0.5rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {previewName}
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {(isPending || data || isError) && (
        <>
          <Divider className="mt-8" />

          {isPending && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-dim)",
                animation: "scan-pulse 1.5s ease-in-out infinite",
              }}
            >
              Extracting metadata - running exiftool…
            </p>
          )}

          {isError && (
            <RequestError
              message={error?.detail ?? "Failed to extract metadata from this file."}
            />
          )}

          {!isPending && data && <ExifMetadata data={data} />}
        </>
      )}
    </ToolPage>
  );
}
