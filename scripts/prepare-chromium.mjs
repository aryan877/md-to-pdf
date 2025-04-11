// This script pre-downloads the Chromium binary during build time
// to improve cold start performance in production
import { execSync } from "child_process";
import fs from "fs";
import https from "https";
import path from "path";

const CHROMIUM_VERSION = "v133.0.0";
const CHROMIUM_URL = `https://github.com/Sparticuz/chromium/releases/download/${CHROMIUM_VERSION}/chromium-${CHROMIUM_VERSION}-pack.tar`;
const CHROMIUM_DIR = path.join(process.cwd(), ".next", "chromium");

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function main() {
  try {
    console.log("Creating Chromium directory...");
    fs.mkdirSync(CHROMIUM_DIR, { recursive: true });

    const tarPath = path.join(CHROMIUM_DIR, "chromium.tar");
    console.log(`Downloading Chromium ${CHROMIUM_VERSION}...`);
    await downloadFile(CHROMIUM_URL, tarPath);

    console.log("Extracting Chromium...");
    execSync(`tar -xf ${tarPath} -C ${CHROMIUM_DIR}`, { stdio: "inherit" });

    console.log("Cleaning up...");
    fs.unlinkSync(tarPath);

    console.log("Chromium preparation complete!");
  } catch (error) {
    console.error("Error preparing Chromium:", error);
    process.exit(1);
  }
}

main();
