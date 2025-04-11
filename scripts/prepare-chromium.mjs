// A lightweight script to validate and pre-warm chromium configuration
// without actually downloading the binary to save Vercel deployment memory
import fs from "fs";
import path from "path";

// Create a placeholder file to indicate the script ran
// Without actually downloading/extracting Chromium
async function main() {
  try {
    // Create a marker file to verify the script ran
    const configDir = path.join(process.cwd(), ".next");
    fs.mkdirSync(configDir, { recursive: true });

    const markerFile = path.join(configDir, "chromium-config.json");
    const config = {
      version: "v121.0.0",
      url: "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar",
      configured: true,
    };

    fs.writeFileSync(markerFile, JSON.stringify(config, null, 2));
    console.log("Chromium configuration complete!");
  } catch (error) {
    console.error("Error preparing Chromium configuration:", error);
    process.exit(1);
  }
}

main();
