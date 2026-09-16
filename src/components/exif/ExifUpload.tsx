"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, RefreshCw } from "lucide-react";

const ACCEPTED     = ["image/jpeg", "image/png", "image/tiff", "image/heic", "image/webp"];
const ACCEPTED_EXT = "JPEG · PNG · TIFF · HEIC · WEBP";

interface ExifUploadProps {
  onFile:   (file: File) => void;
  loading:  boolean;
  hasFile?: boolean;  // true when a file is already loaded — show "replace" variant
}

export function ExifUpload({ onFile, loading, hasFile }: ExifUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function validate(file: File): boolean {
    if (!ACCEPTED.includes(file.type)) {
      setValidationError(
        `Unsupported format: ${file.type || "unknown"}. Accepted: ${ACCEPTED_EXT}.`
      );
      return false;
    }
    setValidationError(null);
    return true;
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (loading) return;
      const file = e.dataTransfer.files[0];
      if (file && validate(file)) onFile(file);
    },
    [onFile, loading]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && validate(file)) onFile(file);
    e.target.value = "";
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={loading ? -1 : 0}
        aria-label={
          hasFile
            ? "Replace image file for EXIF extraction"
            : "Upload image for EXIF extraction — click or drag and drop"
        }
        aria-disabled={loading}
        onDragOver={(e) => {
          e.preventDefault();
          if (!loading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => { if (!loading) inputRef.current?.click(); }}
        onKeyDown={(e) => {
          if (!loading && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        style={{
          border:     dragOver
            ? "1px solid var(--accent)"
            : hasFile
            ? "1px solid var(--border-subtle)"
            : "1px dashed var(--border)",
          background: dragOver ? "var(--accent-glow)" : "var(--surface)",
          padding:    hasFile ? "0.875rem 1.25rem" : "2.5rem 2rem",
          textAlign:  "center",
          cursor:     loading ? "not-allowed" : "pointer",
          transition: "all var(--t-base)",
          opacity:    loading ? 0.55 : 1,
          display:    "flex",
          alignItems: "center",
          gap:        hasFile ? "0.75rem" : undefined,
          flexDirection: hasFile ? "row" : "column",
          justifyContent: hasFile ? "flex-start" : "center",
          maxWidth:   hasFile ? "360px" : "420px",
        }}
      >
        {hasFile ? (
          /* Compact "replace" variant */
          <>
            <RefreshCw
              size={13}
              style={{ color: "var(--text-dim)", flexShrink: 0 }}
              aria-hidden="true"
            />
            <p
              className="t-label"
              style={{ color: "var(--text-dim)" }}
            >
              ANALYSE ANOTHER FILE
            </p>
          </>
        ) : (
          /* Full drop zone */
          <>
            <Upload
              size={18}
              style={{ color: "var(--text-dim)", marginBottom: "0.875rem" }}
              aria-hidden="true"
            />
            <p
              style={{
                fontFamily:   "var(--font-body)",
                fontSize:     "var(--text-sm)",
                color:        dragOver ? "var(--accent)" : "var(--text-muted)",
                marginBottom: "0.25rem",
                transition:   "color var(--t-base)",
              }}
            >
              Drop an image here
            </p>
            <p
              style={{
                fontFamily:   "var(--font-body)",
                fontSize:     "var(--text-xs)",
                color:        "var(--text-dim)",
                marginBottom: "1.25rem",
              }}
            >
              or click to choose a file
            </p>
            <p className="t-label">{ACCEPTED_EXT}</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={handleChange}
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
        disabled={loading}
      />

      {validationError && (
        <p
          className="t-label"
          role="alert"
          style={{
            color:      "var(--error)",
            marginTop:  "0.625rem",
            letterSpacing: "0.06em",
          }}
        >
          {validationError}
        </p>
      )}
    </div>
  );
}
