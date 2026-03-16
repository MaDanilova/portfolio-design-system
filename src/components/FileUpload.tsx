"use client";

import { useState, useCallback, useRef, type DragEvent, type MouseEvent } from "react";
import { Upload, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

type FileUploadState = "idle" | "dragover" | "uploading" | "success" | "error";

const ALLOWED_MIMES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File, maxSize: number): string | null {
  if (!ALLOWED_MIMES.has(file.type)) {
    return "Unsupported file type. Please upload a PDF, PNG, JPG, or WebP.";
  }
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / 1024 / 1024);
    return `File too large. Maximum size is ${maxMB}MB.`;
  }
  return null;
}

function truncateFileName(name: string, max = 35): string {
  if (name.length <= max) return name;
  const ext = name.slice(name.lastIndexOf("."));
  const base = name.slice(0, max - ext.length - 3);
  return `${base}...${ext}`;
}

interface FileUploadProps {
  onFile?: (file: File) => void;
  onClear?: () => void;
  state?: FileUploadState;
  accept?: string;
  maxSize?: number;
  fileName?: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
}

export function FileUpload({
  onFile,
  onClear,
  state: controlledState,
  accept,
  maxSize = DEFAULT_MAX_SIZE,
  fileName,
  label = "Drop your portfolio here",
  hint = "PDF, PNG, JPG, or WebP — max 10MB",
  errorMessage = "Upload failed. Please try again.",
}: FileUploadProps) {
  const [internalState, setInternalState] = useState<FileUploadState>("idle");
  const [internalError, setInternalError] = useState<string | null>(null);
  const state = controlledState ?? internalState;
  const displayError = internalError ?? errorMessage;
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const error = validateFile(file, maxSize);
      if (error) {
        setInternalError(error);
        if (!controlledState) setInternalState("error");
        return;
      }
      setInternalError(null);
      if (!controlledState) setInternalState("idle");
      onFile?.(file);
    },
    [onFile, controlledState, maxSize]
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (!controlledState) setInternalState("dragover");
    },
    [controlledState]
  );

  const handleDragLeave = useCallback(() => {
    if (!controlledState) setInternalState("idle");
  }, [controlledState]);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (!controlledState) setInternalState("idle");
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile, controlledState]
  );

  const handleReplace = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setInternalError(null);
      if (!controlledState) setInternalState("idle");
      onClear?.();
      // Reset file input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
      inputRef.current?.click();
    },
    [controlledState, onClear]
  );

  return (
    <div
      onClick={() => {
        if (state !== "success") inputRef.current?.click();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-fast",
        state !== "success" && "cursor-pointer",
        state === "dragover" && "border-acid bg-acid/5",
        state === "success" && "border-success",
        state === "error" && "border-error",
        state === "idle" && "border-border hover:border-border-strong",
        state === "uploading" && "border-border"
      )}
    >
      {state === "uploading" && (
        <>
          <Spinner size="lg" className="mx-auto mb-3" />
          <p className="text-sm text-ink-secondary">Uploading...</p>
        </>
      )}
      {state === "success" && (
        <>
          <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-ink-primary">
            {fileName ? truncateFileName(fileName) : "Upload complete"}
          </p>
          <button
            type="button"
            onClick={handleReplace}
            className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink-primary mt-2 underline underline-offset-2"
          >
            <RefreshCw className="w-3 h-3" />
            Replace
          </button>
        </>
      )}
      {state === "error" && (
        <>
          <XCircle className="w-8 h-8 text-error mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-error">{displayError}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setInternalError(null);
              if (!controlledState) setInternalState("idle");
            }}
            className="text-xs text-ink-muted hover:text-ink-primary mt-2 underline underline-offset-2"
          >
            Try again
          </button>
        </>
      )}
      {(state === "idle" || state === "dragover") && (
        <>
          <Upload className="w-8 h-8 text-ink-muted mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-ink-secondary">{label}</p>
          <p className="text-xs text-ink-muted mt-1">{hint}</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
    </div>
  );
}
