// Turns the masters in assets/ into responsive WebP files in public/img, share images in public/og,
// and src/data/images.json (dimensions and available widths, read by src/components/Img.astro).
// The results are committed, so the production build needs neither sharp nor this script.
// Run `npm run images` after adding or replacing a master.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const WIDTHS = [480, 800, 1200, 1600, 2048];
const TEAM_WIDTHS = [240, 320, 640];
const OUT = 'public/img';
const OG = 'public/og';
// Share images: only pages use these, not section photos.
const OG_NAMES = /^(home-hero|ueber-hero|overview|.*-hero|blog-.*|bridge-open)$/;

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OG, { recursive: true });
const manifest = {};

async function variant(src, dest, width, quality = 76) {
  if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs > fs.statSync(src).mtimeMs) return;
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(dest);
}

for (const [dir, widths, q] of [['assets/photos', WIDTHS, 76], ['assets/team', TEAM_WIDTHS, 82]]) {
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort()) {
    const name = path.basename(file, '.jpg');
    const src = path.join(dir, file);
    const meta = await sharp(src).metadata();
    const use = widths.filter((w) => w < meta.width);
    use.push(Math.min(meta.width, widths.at(-1)));
    for (const w of use) await variant(src, path.join(OUT, `${name}-${w}.webp`), w, q);
    manifest[name] = { width: meta.width, height: meta.height, widths: use };
    if (OG_NAMES.test(name)) {
      const dest = path.join(OG, `${name}.jpg`);
      if (!fs.existsSync(dest) || fs.statSync(dest).mtimeMs < fs.statSync(src).mtimeMs) {
        await sharp(src).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 78, mozjpeg: true }).toFile(dest);
      }
    }
    console.log(name, use.join(' '));
  }
}
fs.writeFileSync('src/data/images.json', JSON.stringify(manifest, null, 1) + '\n');
