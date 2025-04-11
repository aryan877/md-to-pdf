import { NextRequest, NextResponse } from "next/server";
import path from "path";
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

    const executablePath = path.join(
      process.cwd(),
      ".next",
      "chromium",
      "chromium"
    );

    console.log("Using Chromium at:", executablePath);

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
      ],
    });

    try {
      const page = await browser.newPage();

      // Convert markdown to HTML with styling
      const html = convertMarkdownToHtml(markdown);

      // Set content and wait for network idle
      await page.setContent(html, {
        waitUntil: "networkidle0",
      });

      // Generate PDF with proper margins and format
      const pdf = await page.pdf({
        format: "A4",
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
        printBackground: true,
        preferCSSPageSize: true,
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
