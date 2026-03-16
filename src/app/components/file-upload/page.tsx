"use client";

import { FileUpload } from "@/components/FileUpload";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function FileUploadPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FORMS &amp; INPUT
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          FileUpload
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Drag-and-drop upload zone for portfolio PDFs and screenshots.
          Supports idle, dragover, uploading, success, and error states.
        </p>
      </div>

      <ComponentPreview label="Idle" className="flex-col">
        <div className="w-full max-w-md">
          <FileUpload state="idle" />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<FileUpload onFile={(file) => handleUpload(file)} />`} />

      <ComponentPreview label="Uploading" className="flex-col">
        <div className="w-full max-w-md">
          <FileUpload state="uploading" />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<FileUpload state="uploading" />`} />

      <ComponentPreview label="Success" className="flex-col">
        <div className="w-full max-w-md">
          <FileUpload state="success" />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<FileUpload state="success" />`} />

      <ComponentPreview label="Error" className="flex-col">
        <div className="w-full max-w-md">
          <FileUpload state="error" errorMessage="File too large. Max 10MB." />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<FileUpload state="error" errorMessage="File too large. Max 10MB." />`} />
    </>
  );
}
