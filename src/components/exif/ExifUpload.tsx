"use client";

import { useRef, useState, useCallback } from "react";
import { Upload } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png", "image/tiff", "image/heic", "image/webp"];
const ACCEPTED_EXT = "JPEG · PNG · TIFF · HEIC · WEBP";

interface ExifUploadProps {
  onFile: (file: File) => void;
  loading: boolean;
}

export function ExifUpload({ onFile, loading }: ExifUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function validate(file: File): boolean {
    if (!ACCEPTED.includes(file.type)) {
      setValidationError(`Unsupported format: ${file.type || "unknown"}. Use ${ACCEPTED_EXT}.`);
      return false;
    }
    setValidationError(null);
    return true;
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && validate(file)) onFile(file);
    },
    [onFile]
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
        tabIndex={0}
        aria-label="Upload image for EXIF extraction. Click or drag and drop."
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        style={{
          border: dragOver
            ? "1px solid var(--accent)"
            : "1px solid var(--border-subtle)",
          background: dragOver ? "var(--accent-glow)" : "var(--surface)",
          padding: "3rem 2rem",
          textAlign: "center",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.15s",
          maxWidth: "480px",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <Upload
          size={20}
          style={{ color: "var(--text-dim)", margin: "0 auto 1rem" }}
          aria-hidden="true"
        />
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "0.4rem",
          }}
        >
          Drop an image here
        </p>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "0.8rem",
            marginBottom: "1.25rem",
          }}
        >
          or choose a file
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            color: "var(--text-dim)",
            textTransform: "uppercase",
          }}
        >
          {ACCEPTED_EXT}
        </p>
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
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "rgba(231,80,80,0.8)",
            marginTop: "0.75rem",
          }}
          role="alert"
        >
          {validationError}
        </p>
      )}
    </div>
  );
}
