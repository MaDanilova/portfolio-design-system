"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FileUpload } from "@/components/FileUpload";
import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ProgressBar } from "@/components/ProgressBar";
import { Alert } from "@/components/Alert";
import { cn } from "@/lib/utils";
import {
  saveReview,
  generateId,
  getInitials,
  deriveCategories,
  type ReviewData,
} from "@/lib/reviews";

const focusOptions = [
  { value: "full", label: "Full Review" },
  { value: "positioning", label: "Positioning & First Impression" },
  { value: "caseStudy", label: "Case Study & Storytelling" },
  { value: "visualDesign", label: "Visual Design & Craft" },
  { value: "strategicDepth", label: "Strategic Depth" },
  { value: "copywriting", label: "Copywriting Quality" },
];

const pageTypeOptions = [
  { value: "auto", label: "Auto-detect" },
  { value: "Homepage", label: "Homepage" },
  { value: "Case Study", label: "Case Study" },
  { value: "About", label: "About / Bio" },
  { value: "Project Grid", label: "Work Overview / Grid" },
  { value: "Behance/Dribbble", label: "Behance / Dribbble" },
];

const levelOptions = [
  { value: "not-sure", label: "Not sure" },
  { value: "Junior", label: "Junior" },
  { value: "Mid", label: "Mid-level" },
  { value: "Senior", label: "Senior" },
  { value: "Lead-Manager", label: "Lead / Manager" },
];

type ProcessingStep = "uploading" | "analyzing" | "scoring" | "generating";

const steps: { id: ProcessingStep; label: string }[] = [
  { id: "uploading", label: "Uploading" },
  { id: "analyzing", label: "Analyzing" },
  { id: "scoring", label: "Scoring" },
  { id: "generating", label: "Generating feedback" },
];

const CONTEXT_MAX = 500;
const TIMEOUT_MS = 90_000;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function NewReviewPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("uploading");
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [focus, setFocus] = useState("full");
  const [pageType, setPageType] = useState("auto");
  const [level, setLevel] = useState("not-sure");

  // Smooth progress interpolation
  const [smoothProgress, setSmoothProgress] = useState(0);
  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const targetProgress = ((stepIndex + 1) / steps.length) * 100;

  // Abort controller for cancel + timeout
  const abortRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);

  // Smooth progress: nudge toward target step boundary
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
    setUrl(""); // mutual exclusivity
    setUrlError(null);
    setError(null);
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setFileName(null);
  }, []);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setUrl(val);
      setUrlError(null);
      if (val) {
        // Clear file when user types a URL
        setFile(null);
        setFileName(null);
      }
    },
    []
  );

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    abortRef.current?.abort();
    setProcessing(false);
    setError(null);
  }, []);

  const handleSubmit = async () => {
    // Validation
    if (!file && !url) {
      setError("Please upload a file or provide a URL.");
      return;
    }
    if (url && !isValidUrl(url)) {
      setUrlError("Please enter a valid URL starting with https://");
      return;
    }

    setProcessing(true);
    setError(null);
    setUrlError(null);
    setCurrentStep("uploading");
    cancelledRef.current = false;

    // Set up abort controller with timeout
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // Convert file to base64
      let image: string | undefined;
      if (file) {
        image = await fileToBase64(file);
      }

      setCurrentStep("analyzing");

      // Call API
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          url: url || undefined,
          context: context || undefined,
          focus,
          pageType: pageType !== "auto" ? pageType : undefined,
          level: level !== "not-sure" ? level : undefined,
        }),
        signal: controller.signal,
      });

      setCurrentStep("scoring");

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = (data as { error?: string }).error;

        if (res.status === 422) {
          throw new Error(msg || "This does not appear to be a design portfolio. Please upload a portfolio homepage, case study, or about page screenshot.");
        }
        if (res.status === 413) {
          throw new Error("File is too large for processing. Please reduce file size or use a URL instead.");
        }
        if (res.status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.");
        }
        throw new Error(msg || "Review failed. Please try again.");
      }

      const data = await res.json();

      setCurrentStep("generating");

      // Build full review object and save
      const id = generateId();
      const focusLabel =
        focusOptions.find((o) => o.value === focus)?.label ?? "Full Review";
      const name =
        data.name || fileName?.replace(/\.[^.]+$/, "") || "Untitled Portfolio";

      const review: ReviewData = {
        id,
        name,
        initials: getInitials(name),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        focus: focusLabel,
        overall: data.overall,
        scores: data.scores,
        summary: data.summary,
        strengths: data.strengths,
        improvements: data.improvements,
        pages: data.pages,
        recommendations: data.recommendations,
        categories: deriveCategories(data.scores),
        pageType: data.pageType,
        competitivePosition: data.competitivePosition,
        levelAssessment: data.levelAssessment ?? undefined,
        positioningRewrite: data.positioningRewrite ?? undefined,
        criticalGaps: data.criticalGaps,
      };

      await saveReview(review);

      router.push(`/dashboard/reviews/${id}`);
    } catch (err) {
      clearTimeout(timeoutId);

      // Ignore abort from manual cancel
      if (cancelledRef.current) return;

      setProcessing(false);

      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Review timed out after 90 seconds. Please try again with a smaller image.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  if (processing && !error) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "New Review" },
          ]}
          className="mb-6"
        />

        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" className="mb-6" />
          <ProgressBar
            value={Math.max(smoothProgress, targetProgress - 15)}
            className="max-w-sm mb-6"
          />

          <div className="flex items-center gap-6 mb-4">
            {steps.map((step, i) => (
              <span
                key={step.id}
                className={cn(
                  "text-sm font-body",
                  i === stepIndex
                    ? "text-ink-primary font-medium"
                    : i < stepIndex
                      ? "text-acid"
                      : "text-ink-muted"
                )}
              >
                {i < stepIndex ? "✓ " : ""}
                {step.label}
              </span>
            ))}
          </div>

          <p className="text-xs text-ink-muted mb-6">
            This usually takes 30–60 seconds
          </p>

          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "New Review" },
        ]}
        className="mb-6"
      />

      <h1 className="font-display font-bold text-3xl tracking-tight text-ink-primary">
        Upload your portfolio
      </h1>
      <p className="text-ink-secondary mt-1 mb-8">
        We accept PDFs, images, or website URLs.
      </p>

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

      <div className="space-y-6">
        <FileUpload
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onFile={handleFile}
          onClear={handleClearFile}
          state={fileName ? "success" : undefined}
          fileName={fileName ?? undefined}
        />

        <Divider label="OR" />

        <Input
          label="Portfolio URL"
          placeholder="https://your-portfolio.com"
          id="portfolio-url"
          value={url}
          onChange={handleUrlChange}
          error={urlError ?? undefined}
          disabled={!!fileName}
        />

        <div>
          <Textarea
            label="Context (optional)"
            placeholder="Any specific areas you want feedback on?"
            id="context"
            value={context}
            onChange={(e) =>
              setContext(e.target.value.slice(0, CONTEXT_MAX))
            }
            maxLength={CONTEXT_MAX}
          />
          <p className="text-xs text-ink-muted mt-1.5 text-right">
            {context.length}/{CONTEXT_MAX}
          </p>
        </div>

        <Select
          label="What page is this?"
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
          label="Review focus"
          options={focusOptions}
          id="focus"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
        />

        <div className="flex items-center gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={processing}>
            Start Review
          </Button>
          <Link href="/dashboard">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

