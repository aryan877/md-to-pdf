import chromium from "@sparticuz/chromium-min";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { NextRequest, NextResponse } from "next/server";
import Prism from "prismjs";
import puppeteer from "puppeteer-core";

// Set dynamic execution for this route
export const dynamic = "force-dynamic";
// Set runtime to edge for better performance
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let browser = null;

  try {
    // Parse request body
    const { markdown } = await request.json();

    if (!markdown) {
      return NextResponse.json(
        { error: "Markdown content is required" },
        { status: 400 }
      );
    }

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

    // Create the complete HTML document with styling to match the new design
    const html = `
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
            
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: var(--background);
            }
            
            body {
              font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.7;
              font-size: 11pt;
              color: var(--foreground);
              background-color: var(--background);
              background-image: 
                radial-gradient(circle at 10% 20%, rgba(123, 97, 255, 0.15), transparent 40%), 
                radial-gradient(circle at 90% 80%, rgba(200, 55, 197, 0.15), transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(11, 1, 33, 0.7), var(--background) 70%);
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .container {
              width: 100%;
              max-width: 100%;
              margin: 0;
              padding: 60px 40px 80px 40px;
              min-height: 100vh;
              background: linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
              box-shadow: 0px -2px 40px rgba(187, 155, 255, 0.15), 
                          0px -2px 10px rgba(233, 223, 255, 0.3), 
                          inset 0px 0.5px 0px rgba(255, 255, 255, 0.5);
              border: none;
              position: relative;
              overflow: hidden;
            }
            
            .container::before {
              content: "";
              position: absolute;
              top: -150px;
              right: -150px;
              width: 300px;
              height: 300px;
              background: radial-gradient(circle, rgba(123, 97, 255, 0.25) 0%, transparent 70%);
              border-radius: 50%;
              z-index: -1;
            }
            
            .container::after {
              content: "";
              position: absolute;
              bottom: -150px;
              left: -150px;
              width: 300px;
              height: 300px;
              background: radial-gradient(circle, rgba(200, 55, 197, 0.2) 0%, transparent 70%);
              border-radius: 50%;
              z-index: -1;
            }
            
            h1 {
              font-family: 'Montserrat', sans-serif;
              font-size: 24pt;
              font-weight: 500;
              margin-top: 1.5rem;
              margin-bottom: 1rem;
              color: var(--foreground);
              padding-bottom: 0.4rem;
              border-bottom: 1px solid var(--border);
              line-height: 1.2;
            }
            
            h2 {
              font-family: 'Montserrat', sans-serif;
              font-size: 18pt;
              font-weight: 500;
              margin-top: 1.4rem;
              margin-bottom: 0.8rem;
              padding-bottom: 0.3rem;
              border-bottom: 1px solid var(--border);
              color: var(--foreground);
              line-height: 1.3;
            }
            
            h3 {
              font-family: 'Montserrat', sans-serif;
              font-size: 14pt;
              font-weight: 500;
              margin-top: 1.2rem;
              margin-bottom: 0.6rem;
              color: var(--foreground);
              line-height: 1.4;
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
              box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                0 2px 4px rgba(0, 0, 0, 0.2);
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
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            }
            
            table th, table td {
              border: 1px solid var(--border);
              padding: 0.5rem 0.75rem;
              text-align: left;
            }
            
            table th {
              background-color: rgba(0, 0, 0, 0.3);
              font-weight: 500;
              text-align: left;
              border-bottom: 2px solid var(--border);
            }
            
            table tr:nth-child(even) {
              background-color: rgba(0, 0, 0, 0.2);
            }
            
            table tr:nth-child(odd) {
              background-color: transparent;
            }
            
            table tr:hover {
              background-color: rgba(123, 97, 255, 0.1);
            }
            
            /* Table border radius fixes */
            table tr:first-child th:first-child {
              border-top-left-radius: 0.3rem;
            }
            
            table tr:first-child th:last-child {
              border-top-right-radius: 0.3rem;
            }
            
            table tr:last-child td:first-child {
              border-bottom-left-radius: 0.3rem;
            }
            
            table tr:last-child td:last-child {
              border-bottom-right-radius: 0.3rem;
            }
            
            img {
              max-width: 100%;
              border-radius: 0.3rem;
              margin: 1rem 0;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            }
            
            hr {
              border: 0;
              height: 1px;
              background-color: var(--border);
              margin: 1.5rem 0;
            }
            
            .logo-container {
              display: flex;
              justify-content: center;
              margin-bottom: 2.5rem;
              position: relative;
            }
            
            .logo-container::before {
              content: "";
              position: absolute;
              width: 150px;
              height: 6px;
              background: linear-gradient(90deg, transparent, rgba(123, 97, 255, 0.3), transparent);
              bottom: -1.5rem;
              border-radius: 3px;
            }
            
            .logo {
              width: 70px;
              height: 70px;
              background: linear-gradient(135deg, var(--primary), var(--secondary));
              border-radius: 0.75rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 36px;
              box-shadow: 0 0 30px rgba(89, 29, 221, 0.6);
              position: relative;
              overflow: hidden;
            }
            
            .logo::before {
              content: "";
              position: absolute;
              inset: 0;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(5px);
            }
            
            @page {
              size: A4;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <div class="logo">
                <span style="position: relative; z-index: 2;">M</span>
              </div>
            </div>
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

    // Improved browser launch with caching and better error handling
    if (process.env.NODE_ENV === "production") {
      console.log("Running in production environment");

      // Load fonts for emojis and other special characters
      await chromium.font(
        "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
      );

      // Get executable path with defined temp directory for Vercel
      const executablePath = await chromium.executablePath("/tmp/chromium");

      // Launch browser with optimized settings
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-setuid-sandbox",
          "--no-first-run",
          "--no-sandbox",
          "--no-zygote",
          "--deterministic-fetch",
          "--disable-features=IsolateOrigins",
          "--disable-site-isolation-trials",
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    } else {
      // Local Development Environment
      console.log("Running in development environment");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
    }

    const page = await browser.newPage();

    // Set navigation timeout to prevent long-running processes
    page.setDefaultNavigationTimeout(30000);

    // Set content with proper waiting strategy
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Generate PDF with proper formatting
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width: 100%; font-size: 8pt; color: rgba(255, 255, 255, 0.7); padding: 0 1cm; display: flex; justify-content: center; font-family: 'Montserrat', sans-serif; background-color: rgba(11, 1, 33, 0.9);">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: "0",
        right: "0",
        bottom: "1cm",
        left: "0",
      },
      preferCSSPageSize: true,
    });

    // Return PDF as downloadable response
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="markdown-document.pdf"',
        "Cache-Control": "s-maxage=1, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate PDF: ${
          error instanceof Error ? error.message : String(error)
        }`,
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Ensure browser is always closed to prevent memory leaks
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
}
