import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const assetDir = path.resolve(scriptDir, "..", "sales-assets");

const images = [
  "01-product-website.png",
  "02-command-center.png",
  "03-lead-pipeline.png",
  "04-unified-inbox.png",
  "05-automations.png",
  "06-client-portal.png",
  "07-review-system.png",
  "08-revenue-reports.png",
  "09-white-label-settings.png",
];

for (const [index, filename] of images.entries()) {
  const source = path.join(assetDir, filename);
  const metadata = await sharp(source).metadata();
  const width = metadata.width ?? 1600;
  const height = Math.round(width * 0.75);

  const backdrop = await sharp(source)
    .resize(width, height, { fit: "cover" })
    .blur(30)
    .modulate({ brightness: 0.76, saturation: 0.82 })
    .png()
    .toBuffer();

  const foreground = await sharp(source)
    .resize(Math.round(width * 0.76), Math.round(height * 0.84), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const output = path.join(
    assetDir,
    `upwork-safe-${String(index + 1).padStart(2, "0")}-${filename}`,
  );

  await sharp(backdrop)
    .composite([{ input: foreground, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log(output);
}
