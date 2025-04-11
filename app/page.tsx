"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const sampleMarkdown = `# Welcome to Markdown to PDF

This is a simple editor where you can:

1. Write or paste Markdown on the left
2. See a live preview on the right
3. Download the content as a beautiful PDF

## Features

- **Live Preview**: See your changes instantly
- **Full Height**: Utilizes the full viewport height
- **Responsive**: Works on all screen sizes
- **Download as PDF**: Convert your markdown to a professional PDF document

## Example Formatting

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Tables

| Name | Description |
|------|-------------|
| Item 1 | Description 1 |
| Item 2 | Description 2 |

### And more...

- Lists
- *Italic Text*
- **Bold Text**
- [Links](https://example.com)
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(sampleMarkdown);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineCount, setLineCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Update line numbers when markdown changes
  useEffect(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      const lines = markdown.split("\n");
      setLineCount(lines.length);

      // Clear existing line numbers
      lineNumbersRef.current.innerHTML = "";

      // Create line numbers
      lines.forEach((_, index) => {
        const lineNumber = document.createElement("div");
        lineNumber.textContent = (index + 1).toString();
        lineNumbersRef.current?.appendChild(lineNumber);
      });
    }
  }, [markdown]);

  // Sync scroll between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textarea || !lineNumbers) return;

    const handleScroll = () => {
      if (lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    };

    textarea.addEventListener("scroll", handleScroll);

    return () => {
      textarea.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const generatePDF = async () => {
    if (!previewRef.current) return;

    setIsGeneratingPDF(true);
    setError(null);

    try {
      // Use the API route for PDF generation
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdown }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Get the PDF blob from the response
      const blob = await response.blob();

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "markdown-document.pdf";
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate PDF"
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-[var(--font-montserrat)]">
      {/* Header with gradient background */}
      <header className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary)] opacity-20 backdrop-blur-xl"></div>

        {/* Improved decorative elements - positioned differently */}
        <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-[var(--primary)] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-[var(--secondary)] opacity-10 rounded-full blur-3xl"></div>

        <div className="relative flex items-center justify-between mx-auto max-w-7xl z-10">
          {/* Logo and title using simple flex layout */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-icon">
                <span>P</span>
              </div>
            </div>

            {/* Title - Hidden on mobile, visible on PC */}
            <h1 className="app-title hidden sm:block text-[16px] sm:text-[18px] md:text-[20px] font-normal tracking-tight font-[var(--font-inter)] text-white/80">
              PageMinty
            </h1>
          </div>

          <div className="button-container">
            {/* Toggle button - only visible on mobile */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-toggle"
            >
              {showPreview ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 sm:mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Editor</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 sm:mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  <span>Preview</span>
                </>
              )}
            </button>

            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="btn-primary"
            >
              {isGeneratingPDF ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-1 sm:mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 sm:mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-1 max-w-7xl mx-auto bg-red-900/70 border border-red-500 text-white px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
            Error: {error}
          </div>
        )}
      </header>

      {/* Main editor & preview area with increased spacing */}
      <div className="flex-grow flex overflow-hidden p-2">
        <div className="flex w-full h-full rounded-xl overflow-hidden shadow-2xl">
          {/* Editor - Left page */}
          <div
            className={`editor-container border-r border-[var(--border)] ${
              showPreview ? "mobile-hidden" : ""
            }`}
          >
            <div className="editor-header">
              <div className="w-3 h-3 rounded-full bg-[var(--primary)] mr-3"></div>
              <h3 className="font-medium text-sm text-white/80">Markdown</h3>
              <div className="line-count">{lineCount} lines</div>
            </div>
            <div className="editor-content">
              <div className="line-numbers" ref={lineNumbersRef}></div>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type or paste your Markdown here..."
              />
            </div>
          </div>

          {/* Preview - Right page */}
          <div
            className={`preview-container ${
              !showPreview ? "mobile-hidden" : ""
            }`}
          >
            <div className="preview-header">
              <div className="w-3 h-3 rounded-full bg-[var(--secondary)] mr-3"></div>
              <h3 className="font-medium text-sm text-white/80">Preview</h3>
            </div>
            <div className="preview-content" ref={previewRef}>
              <div className="preview-wrapper markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
