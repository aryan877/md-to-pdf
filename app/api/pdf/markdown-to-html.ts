import { marked } from "marked";

export function convertMarkdownToHtml(markdown: string): string {
  // Basic markdown conversion with minimal styling
  const htmlContent = marked(markdown, {
    gfm: true,
    breaks: true,
  });

  // Create a minimal HTML document with PageMinty styling
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>PageMinty Document</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');
          
          :root {
            --mint: #4ade80;
            --mint-dark: #22c55e;
            --accent: #818cf8;
          }
          
          body {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.7;
            font-size: 11pt;
            color: #333;
            background-color: #fff;
            padding: 30px;
            max-width: 750px;
            margin: 0 auto;
          }
          
          h1, h2, h3, h4, h5, h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-weight: 500;
            line-height: 1.3;
            color: #111;
          }
          
          h1 {
            font-size: 24pt;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #f0f0f0;
            margin-bottom: 1.5rem;
          }
          
          h2 {
            font-size: 18pt;
            padding-bottom: 0.3rem;
            border-bottom: 1px solid #f0f0f0;
            margin-top: 2.5rem;
          }
          
          h3 {
            font-size: 14pt;
            margin-top: 1.8rem;
          }
          
          p, ul, ol {
            margin-bottom: 1.2rem;
            letter-spacing: 0.01rem;
          }
          
          a {
            color: var(--mint-dark);
            text-decoration: none;
            border-bottom: 1px solid var(--mint);
            transition: all 0.2s ease;
          }
          
          a:hover {
            color: var(--accent);
            border-color: var(--accent);
          }
          
          ul, ol {
            padding-left: 1.8rem;
          }
          
          li {
            margin-bottom: 0.5rem;
          }
          
          code {
            background-color: #f5f5f5;
            border-radius: 0.25rem;
            font-family: "SFMono-Regular", Consolas, monospace;
            padding: 0.2rem 0.4rem;
            font-size: 0.9em;
            color: #476582;
          }
          
          pre {
            background-color: #f8f8f8;
            border-radius: 0.5rem;
            padding: 1.2rem;
            margin: 1.5rem 0;
            overflow-x: auto;
            border: 1px solid #eee;
          }
          
          pre code {
            background-color: transparent;
            padding: 0;
            color: #333;
            font-size: 0.9em;
          }
          
          blockquote {
            border-left: 4px solid var(--mint);
            padding: 0.8rem 1.2rem;
            margin: 1.5rem 0;
            background-color: #f9f9f9;
            border-radius: 0 0.4rem 0.4rem 0;
          }
          
          blockquote p {
            margin-bottom: 0;
          }
          
          table {
            border-collapse: collapse;
            margin: 1.5rem 0;
            width: 100%;
            border-radius: 0.4rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          
          table th, table td {
            border: 1px solid #eee;
            padding: 0.75rem 1rem;
            text-align: left;
          }
          
          table th {
            background-color: #f5f5f5;
            font-weight: 500;
          }
          
          table tr:nth-child(even) {
            background-color: #fafafa;
          }
          
          img {
            max-width: 100%;
            margin: 1.5rem 0;
            border-radius: 0.4rem;
            box-shadow: 0 1px 5px rgba(0,0,0,0.05);
          }
          
          hr {
            border: 0;
            height: 1px;
            background-color: #eee;
            margin: 2rem 0;
          }
          
          /* PageMinty footer */
          .pageminty-footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 1.5rem;
            font-size: 0.8rem;
            color: #888;
            border-top: 1px solid #eee;
          }
          
          .pageminty-footer a {
            color: var(--mint-dark);
            text-decoration: none;
            border: none;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        
        <div class="pageminty-footer">
          Created with <a href="https://pageminty.xyz">PageMinty</a>
        </div>
      </body>
    </html>
  `;
}
