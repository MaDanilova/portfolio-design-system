interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="bg-surface-overlay border border-border rounded-xl p-5 overflow-x-auto mb-10">
      <code className="text-xs font-mono text-ink-secondary leading-relaxed whitespace-pre">
        {code}
      </code>
    </pre>
  );
}
