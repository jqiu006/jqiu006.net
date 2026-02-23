"use client";

import { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  async function handleCopy() {
    const text = preRef.current?.querySelector("code")?.innerText ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="not-prose my-6 rounded-lg overflow-hidden border border-border text-sm relative group">
      {/* Copy button — floats top-right, semi-transparent until hover */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 text-xs opacity-30 hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-accent" />
            <span className="text-accent">Copied!</span>
          </>
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Code */}
      <pre
        ref={preRef}
        {...props}
        className="overflow-x-auto p-4 !m-0 !rounded-none !border-0 leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}
