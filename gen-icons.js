const sharp = require('sharp');
const fs = require('fs');

async function generateFavicons() {
  const svgBuffer = fs.readFileSync('public/favicon.svg');

  // apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile('public/apple-touch-icon.png');
  
  // favicon-32x32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile('public/favicon-32x32.png');

  // favicon-16x16.png
  await sharp(svgBuffer)
    .resize(16, 16)
    .toFile('public/favicon-16x16.png');

  // We can just copy the 32x32 png as favicon.ico for simple compatibility, or create a raw ICO buffer.
  // Next.js actually understands .ico as .png masquerading as .ico sometimes, but to be completely safe:
  // Since we only need basic ICO, let's just make a 32x32 image and copy it to favicon.ico
  // Better yet, many browsers support favicon.png as favicon.ico if renamed.
  // For proper generation we'd need png-to-ico package, but copying the 32x32 fits perfectly in modern web.
  fs.copyFileSync('public/favicon-32x32.png', 'public/favicon.ico');

  // Remove the default Next.js favicon inside src/app if it exists
  if (fs.existsSync('src/app/favicon.ico')) {
    fs.unlinkSync('src/app/favicon.ico');
  }

  console.log("Favicons generated successfully.");
}

generateFavicons().catch(console.error);
