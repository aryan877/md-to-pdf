import { marked } from "marked";

export function convertMarkdownToHtml(markdown: string): string {
  // Basic markdown conversion with minimal styling
  const htmlContent = marked(markdown, {
    gfm: true,
    breaks: true,
  });

  // Create a minimal HTML document with essential styling
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Markdown Document</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');
          
          body {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.6;
            font-size: 11pt;
            color: #333;
            background-color: #fff;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          h1 {
            font-size: 22pt;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid #eee;
          }
          
          h2 {
            font-size: 18pt;
            margin-top: 1.4rem;
            margin-bottom: 0.8rem;
          }
          
          h3 {
            font-size: 14pt;
            margin-top: 1.2rem;
            margin-bottom: 0.6rem;
          }
          
          p, ul, ol {
            margin-bottom: 1rem;
          }
          
          code {
            background-color: #f5f5f5;
            border-radius: 0.25rem;
            font-family: monospace;
            padding: 0.1rem 0.2rem;
            font-size: 0.9em;
          }
          
          pre {
            background-color: #f5f5f5;
            border-radius: 0.4rem;
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
          }
          
          pre code {
            background-color: transparent;
            padding: 0;
          }
          
          blockquote {
            border-left: 3px solid #ccc;
            padding: 0.5rem 1rem;
            margin: 1rem 0;
            background-color: #f9f9f9;
          }
          
          table {
            border-collapse: collapse;
            margin: 1rem 0;
            width: 100%;
          }
          
          table th, table td {
            border: 1px solid #ddd;
            padding: 0.5rem;
            text-align: left;
          }
          
          table th {
            background-color: #f5f5f5;
          }
          
          img {
            max-width: 100%;
            margin: 1rem 0;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;
}
