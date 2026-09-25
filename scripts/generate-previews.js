const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const uploadsDir = path.join(__dirname, "../images/uploads");
const previewsDir = path.join(__dirname, "../images/previews");

// CHANGE ce nom pour qu'il corresponde exactement à ton fichier watermark
const watermarkPath = path.join(
  __dirname,
  "../images/watermark/watermark.png"
);

if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

async function generatePreviews() {
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const extension = path.extname(file).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      continue;
    }

    const inputPath = path.join(uploadsDir, file);

    const fileName = path.parse(file).name;

    const outputPath = path.join(
      previewsDir,
      `${fileName}.webp`
    );

    console.log(`Traitement de ${file}...`);

    const image = sharp(inputPath);

    const metadata = await image.metadata();

    const width = Math.min(metadata.width || 1600, 1600);

    const watermark = await sharp(watermarkPath)
      .resize({
        width: width,
        fit: "inside"
      })
      .png()
      .toBuffer();

    await image
      .resize({
        width: width,
        withoutEnlargement: true
      })
      .composite([
        {
          input: watermark,
          gravity: "center"
        }
      ])
      .webp({
        quality: 75
      })
      .toFile(outputPath);

    console.log(`✓ Preview créée : ${fileName}.webp`);
  }
}

generatePreviews()
  .then(() => {
    console.log("Toutes les previews ont été créées.");
  })
  .catch((error) => {
    console.error(error);
  });