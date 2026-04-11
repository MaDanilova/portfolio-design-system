"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/FileUpload";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ProgressBar } from "@/components/ProgressBar";
import { Alert } from "@/components/Alert";
import {
  saveReview,
  buildReviewData,
} from "@/lib/reviews";
import { focusOptions, pageTypeOptions, levelOptions } from "@/lib/constants";

type ProcessingStep = "uploading" | "analyzing" | "scoring" | "generating";

const steps: { id: ProcessingStep; label: string }[] = [
  { id: "uploading", label: "Uploading" },
  { id: "analyzing", label: "Analyzing" },
  { id: "scoring", label: "Scoring" },
  { id: "generating", label: "Generating feedback" },
];

const CONTEXT_MAX = 500;
const TIMEOUT_MS = 90_000;

function mapReviewApiError(status: number, apiError?: string): string {
  if (status === 401) return "Your session expired. Please sign in again.";
  if (status === 422) {
    return apiError || "This does not appear to be a design portfolio.";
  }
  if (status === 413) return "File is too large. Please reduce file size.";
  if (status === 429) return "Too many requests. Please wait a moment.";
  return apiError || "Review failed. Please try again.";
}

export default function DashboardCanvasPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("uploading");
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [focus, setFocus] = useState("full");
  const [pageType, setPageType] = useState("auto");
  const [level, setLevel] = useState("not-sure");
  const [showOptions, setShowOptions] = useState(false);

  // Smooth progress
  const [smoothProgress, setSmoothProgress] = useState(0);
  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const targetProgress = ((stepIndex + 1) / steps.length) * 100;

  const abortRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!processing) {
      setSmoothProgress(0);
      return;
    }
    const stepBase = (stepIndex / steps.length) * 100;
    const stepCeil = targetProgress;
    setSmoothProgress(stepBase);

    const interval = setInterval(() => {
      setSmoothProgress((prev) => {
        const next = prev + 1.5;
        return next >= stepCeil - 2 ? prev : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [processing, stepIndex, targetProgress]);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setFileName(f.name);
    setError(null);
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setFileName(null);
  }, []);

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    abortRef.current?.abort();
    setProcessing(false);
    setError(null);
  }, []);

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a portfolio file.");
      return;
    }

    setProcessing(true);
    setError(null);
    setCurrentStep("uploading");
    cancelledRef.current = false;

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      setCurrentStep("analyzing");

      const formData = new FormData();
      formData.append("file", file);
      if (context) formData.append("context", context);
      formData.append("focus", focus);
      if (pageType !== "auto") formData.append("pageType", pageType);
      if (level !== "not-sure") formData.append("level", level);

      const res = await fetch("/api/review", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      setCurrentStep("scoring");

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = (data as { error?: string }).error;
        throw new Error(mapReviewApiError(res.status, msg));
      }

      const data = await res.json();
      setCurrentStep("generating");

      const focusLabel =
        focusOptions.find((o) => o.value === focus)?.label ?? "Full Review";
      const review = buildReviewData(data, fileName, focusLabel);
      await saveReview(review);

      router.push(`/dashboard/reviews/${review.id}`);
    } catch (err) {
      if (cancelledRef.current) return;
      setProcessing(false);

      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Review timed out. Please try again with a smaller file.");
      } else {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // Processing state — centered on canvas
  if (processing && !error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-dots">
        <div className="flex flex-col items-center max-w-sm w-full px-6">
          <Spinner size="lg" className="mb-6" />
          <ProgressBar
            value={Math.max(smoothProgress, targetProgress - 15)}
            className="w-full mb-6"
          />

          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            {steps.map((step, i) => (
              <span
                key={step.id}
                className={cn(
                  "text-sm font-body",
                  i === stepIndex
                    ? "text-ink-primary font-medium"
                    : i < stepIndex
                      ? "text-ink-primary"
                      : "text-ink-muted"
                )}
              >
                {i < stepIndex ? "\u2713 " : ""}
                {step.label}
              </span>
            ))}
          </div>

          <p className="text-xs text-ink-muted mb-6">
            This usually takes 30\u201360 seconds
          </p>

          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Default state — canvas with drop zone
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-dots px-6">
      <div className="w-full max-w-lg">
        {/* Hero text */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-ink-primary mb-2">
            Review your portfolio
          </h1>
          <p className="text-ink-secondary text-sm">
            Drop a PDF or image and get AI feedback in under a minute.
          </p>
        </div>

        {error && (
          <Alert
            status="error"
            title="Review failed"
            dismissible
            onDismiss={() => setError(null)}
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {/* Drop zone */}
        <div className="bg-surface-base rounded-xl border border-border p-1">
          <FileUpload
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onFile={handleFile}
            onClear={handleClearFile}
            state={fileName ? "success" : undefined}
            fileName={fileName ?? undefined}
          />
        </div>

        {/* Collapsible options */}
        <div className="mt-4">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 text-xs text-ink-muted hover:text-ink-secondary transition-colors duration-fast mx-auto"
          >
            {showOptions ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {showOptions ? "Hide options" : "Review options"}
          </button>

          {showOptions && (
            <div className="mt-4 space-y-4 bg-surface-base rounded-xl border border-border p-5">
              <Textarea
                label="Context (optional)"
                placeholder="Any specific areas you want feedback on?"
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value.slice(0, CONTEXT_MAX))}
                maxLength={CONTEXT_MAX}
              />

              <div className="grid grid-cols-3 gap-3">
                <Select
                  label="Page type"
                  options={pageTypeOptions}
                  id="page-type"
                  value={pageType}
                  onChange={(e) => setPageType(e.target.value)}
                />
                <Select
                  label="Your level"
                  options={levelOptions}
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
                <Select
                  label="Focus"
                  options={focusOptions}
                  id="focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        {file && (
          <div className="mt-6 flex justify-center">
            <Button onClick={handleSubmit} disabled={processing}>
              Start Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
