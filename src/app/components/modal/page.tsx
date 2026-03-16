"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function ModalPage() {
  const [smOpen, setSmOpen] = useState(false);
  const [mdOpen, setMdOpen] = useState(false);
  const [lgOpen, setLgOpen] = useState(false);

  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          OVERLAYS &amp; NAV
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Modal
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Dialog overlay for confirmations and focused tasks. Three sizes
          (sm/md/lg). GSAP backdrop fade + panel scale animation. Escape key
          to close.
        </p>
      </div>

      <ComponentPreview label="Small">
        <Button variant="ghost" onClick={() => setSmOpen(true)}>
          Open Small Modal
        </Button>
        <Modal open={smOpen} onClose={() => setSmOpen(false)} size="sm" title="Delete review?">
          <p className="text-sm text-ink-secondary mb-6">
            This action cannot be undone. The review and all associated data will be permanently removed.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setSmOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setSmOpen(false)}>Delete</Button>
          </div>
        </Modal>
      </ComponentPreview>

      <CodeBlock
        code={`<Modal open={open} onClose={close} size="sm" title="Delete review?">
  <p>This action cannot be undone.</p>
  <Button variant="ghost" onClick={close}>Cancel</Button>
  <Button variant="primary" onClick={confirm}>Delete</Button>
</Modal>`}
      />

      <ComponentPreview label="Medium (default)">
        <Button variant="ghost" onClick={() => setMdOpen(true)}>
          Open Medium Modal
        </Button>
        <Modal open={mdOpen} onClose={() => setMdOpen(false)} title="Share review">
          <p className="text-sm text-ink-secondary mb-4">
            Generate a shareable link for this portfolio review.
          </p>
          <div className="bg-surface-raised border border-border rounded px-3 py-2.5 text-sm font-mono text-ink-secondary mb-6">
            https://review.ai/share/abc123
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setMdOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setMdOpen(false)}>Copy Link</Button>
          </div>
        </Modal>
      </ComponentPreview>

      <CodeBlock code={`<Modal open={open} onClose={close} title="Share review">...</Modal>`} />

      <ComponentPreview label="Large">
        <Button variant="ghost" onClick={() => setLgOpen(true)}>
          Open Large Modal
        </Button>
        <Modal open={lgOpen} onClose={() => setLgOpen(false)} size="lg" title="Review settings">
          <p className="text-sm text-ink-secondary mb-4">
            Configure how the AI analyzes your portfolio. These settings apply to all future reviews.
          </p>
          <div className="space-y-3 mb-6">
            <div className="bg-surface-raised border border-border rounded-xl p-4">
              <p className="text-sm text-ink-primary font-medium">Focus areas</p>
              <p className="text-xs text-ink-muted mt-1">Layout, Typography, Color, Accessibility, Performance</p>
            </div>
            <div className="bg-surface-raised border border-border rounded-xl p-4">
              <p className="text-sm text-ink-primary font-medium">Strictness level</p>
              <p className="text-xs text-ink-muted mt-1">Standard — balanced feedback between praise and critique</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setLgOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setLgOpen(false)}>Save Settings</Button>
          </div>
        </Modal>
      </ComponentPreview>

      <CodeBlock code={`<Modal open={open} onClose={close} size="lg" title="Review settings">...</Modal>`} />
    </>
  );
}
