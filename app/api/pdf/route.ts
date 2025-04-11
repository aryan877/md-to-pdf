import chromium from "@sparticuz/chromium-min";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { convertMarkdownToHtml } from "./markdown-to-html";

// Set dynamic execution for this route
export const dynamic = "force-dynamic";
// Set runtime to edge for better performance
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { markdown } = await request.json();
    if (!markdown) {
      return NextResponse.json(
        { error: "Markdown content is required" },
        { status: 400 }
      );
    }

    // Launch browser with minimal memory usage
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
      ],
      defaultViewport: { width: 800, height: 600 },
      executablePath: await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar"
      ),
      headless: true,
    });

    try {
      const page = await browser.newPage();

      // Optimize memory usage by limiting resources
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        // Allow only necessary resources
        if (
          ["document", "stylesheet", "font"].includes(request.resourceType())
        ) {
          request.continue();
        } else {
          request.abort();
        }
      });

      // Convert markdown to HTML with PageMinty branding
      const html = convertMarkdownToHtml(markdown);

      // Set content with minimal wait time
      await page.setContent(html, {
        waitUntil: "domcontentloaded",
      });

      // Generate compact PDF
      const pdf = await page.pdf({
        format: "A4",
        margin: {
          top: "25mm",
          right: "20mm",
          bottom: "25mm",
          left: "20mm",
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="width: 100%; font-size: 8px; font-family: Montserrat, sans-serif; color: #888; padding: 0 20px; display: flex; justify-content: space-between;">
            <div>Generated with PageMinty</div>
            <div>pageminty.xyz</div>
          </div>
        `,
        footerTemplate: `
          <div style="width: 100%; font-size: 8px; font-family: Montserrat, sans-serif; color: #888; padding: 0 20px; display: flex; justify-content: space-between;">
            <div>PageMinty PDF</div>
            <div><span class="pageNumber"></span> of <span class="totalPages"></span></div>
          </div>
        `,
      });

      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="pageminty-document.pdf"',
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
