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

      // Convert markdown to HTML
      const html = convertMarkdownToHtml(markdown);

      // Set content with minimal wait time
      await page.setContent(html, {
        waitUntil: "domcontentloaded",
      });

      // Generate compact PDF
      const pdf = await page.pdf({
        format: "A4",
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
        printBackground: true,
        omitBackground: false,
      });

      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="document.pdf"',
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
