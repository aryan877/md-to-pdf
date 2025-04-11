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
      <header className="relative py-7 sm:py-8 px-6 sm:px-10 md:px-16 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary)] opacity-20 backdrop-blur-xl"></div>

        {/* Improved decorative elements - positioned differently */}
        <div className="absolute top-0 right-0 w-48 h-48 -mr-20 -mt-20 bg-[var(--primary)] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 -ml-20 -mb-20 bg-[var(--secondary)] opacity-10 rounded-full blur-3xl"></div>

        <div className="relative flex items-center justify-between mx-auto max-w-7xl z-10">
          {/* Logo and title using simple flex layout */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-icon">
                <span>P</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight">
              PageMinty
            </h1>
          </div>

          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="btn-primary ml-4"
          >
            {isGeneratingPDF ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
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
                <span className="sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                <span className="sm:inline">Download PDF</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 max-w-7xl mx-auto bg-red-900/70 border border-red-500 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
            Error: {error}
          </div>
        )}
      </header>

      {/* Main editor & preview area with increased spacing */}
      <div className="flex-grow flex overflow-hidden p-2">
        <div className="flex w-full h-full rounded-xl overflow-hidden shadow-2xl">
          {/* Editor - Left page */}
          <div className="editor-container border-r border-[var(--border)]">
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
          <div className="preview-container">
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
