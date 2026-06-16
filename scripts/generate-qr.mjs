import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import QRCode from "qrcode";

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env.local");
const outputDirectory = path.join(projectRoot, "qr-output");
const baseUrl = (process.argv[2] ?? "https://cafeevnet.vercel.app").replace(
  /\/$/,
  "",
);

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator);
        let value = line.slice(separator + 1);

        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        return [key, value];
      }),
  );
}

const localEnv = parseEnv(await readFile(envPath, "utf8"));
const qrToken = process.env.BRAVI_QR_TOKEN ?? localEnv.BRAVI_QR_TOKEN;

if (!qrToken) {
  throw new Error("BRAVI_QR_TOKEN이 .env.local에 설정되어 있어야 합니다.");
}

const qrUrl = `${baseUrl}/q/bravi?t=${encodeURIComponent(qrToken)}`;
const pngPath = path.join(outputDirectory, "bravi-event-qr.png");
const svgPath = path.join(outputDirectory, "bravi-event-qr.svg");
const options = {
  errorCorrectionLevel: "H",
  margin: 4,
  color: {
    dark: "#17130FFF",
    light: "#FFFFFFFF",
  },
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  QRCode.toFile(pngPath, qrUrl, { ...options, type: "png", width: 1200 }),
  QRCode.toFile(svgPath, qrUrl, { ...options, type: "svg" }),
]);

console.log(`QR URL: ${qrUrl}`);
console.log(`PNG: ${pngPath}`);
console.log(`SVG: ${svgPath}`);
