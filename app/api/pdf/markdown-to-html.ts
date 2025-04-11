import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism-tomorrow.css";

export function convertMarkdownToHtml(markdown: string): string {
  // Configure marked with GitHub Flavored Markdown options
  marked.use(
    gfmHeadingId(),
    markedHighlight({
      highlight: (code: string, lang: string) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    }),
    {
      gfm: true,
      breaks: true,
      pedantic: false,
    }
  );

  // Convert markdown to HTML with proper syntax highlighting
  const htmlContent = marked(markdown);

  // Create the complete HTML document with styling
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Markdown Document</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
          
          :root {
            --primary: #7B61FF;
            --secondary: #C837C5;
            --foreground: #ECECEC;
            --background: #0B0121;
            --card-bg: rgba(255, 255, 255, 0.05);
            --border: rgba(255, 255, 255, 0.1);
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.7;
            font-size: 11pt;
            color: var(--foreground);
            background-color: var(--background);
            padding: 40px;
          }
          
          h1 {
            font-size: 24pt;
            font-weight: 500;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            color: var(--foreground);
            padding-bottom: 0.4rem;
            border-bottom: 1px solid var(--border);
          }
          
          h2 {
            font-size: 18pt;
            font-weight: 500;
            margin-top: 1.4rem;
            margin-bottom: 0.8rem;
            padding-bottom: 0.3rem;
            border-bottom: 1px solid var(--border);
          }
          
          h3 {
            font-size: 14pt;
            font-weight: 500;
            margin-top: 1.2rem;
            margin-bottom: 0.6rem;
          }
          
          p {
            margin-bottom: 1rem;
          }
          
          a {
            color: var(--primary);
            text-decoration: underline;
          }
          
          ul, ol {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
          }
          
          li {
            margin-bottom: 0.4rem;
          }
          
          code {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            padding: 0.1rem 0.2rem;
            font-size: 0.9em;
            color: var(--primary);
          }
          
          pre {
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 0.4rem;
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
          }
          
          pre code {
            background-color: transparent;
            padding: 0;
            color: var(--foreground);
            font-size: 0.9em;
            line-height: 1.5;
          }
          
          blockquote {
            border-left: 3px solid var(--secondary);
            padding: 0.5rem 1rem;
            font-style: italic;
            margin: 1rem 0;
            background-color: rgba(123, 97, 255, 0.1);
            border-radius: 0 0.3rem 0.3rem 0;
          }
          
          table {
            border-collapse: separate;
            border-spacing: 0;
            margin: 1rem 0;
            width: 100%;
            border: 1px solid var(--border);
            border-radius: 0.3rem;
            overflow: hidden;
          }
          
          table th, table td {
            border: 1px solid var(--border);
            padding: 0.5rem 0.75rem;
            text-align: left;
          }
          
          table th {
            background-color: rgba(0, 0, 0, 0.3);
            font-weight: 500;
          }
          
          table tr:nth-child(even) {
            background-color: rgba(0, 0, 0, 0.2);
          }
          
          img {
            max-width: 100%;
            border-radius: 0.3rem;
            margin: 1rem 0;
          }
          
          hr {
            border: 0;
            height: 1px;
            background-color: var(--border);
            margin: 1.5rem 0;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;
}
