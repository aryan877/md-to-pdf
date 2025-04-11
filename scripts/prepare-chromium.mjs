// This script pre-downloads the Chromium binary during build time
// to improve cold start performance in production
import chromium from "@sparticuz/chromium-min";

async function prepareChromium() {
  console.log("🔧 Preparing Chromium binary for production...");

  try {
    // Define temp directory for Chromium
    process.env.CHROMIUM_PATH = "/tmp/chromium";

    // Download and cache the Chromium binary
    console.log("📥 Downloading Chromium...");
    await chromium.font(
      "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
    );
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"
    );

    console.log("✅ Chromium binary preparation completed successfully");
    console.log(`📁 Executable path: ${executablePath}`);
  } catch (error) {
    console.error("❌ Failed to prepare Chromium binary:");
    console.error(error);
    // Don't fail the build process
    console.log("⚠️ Continuing with build despite Chromium preparation error");
  }
}

prepareChromium();
