// Turns the masters in assets/ into responsive WebP files in public/img, share images in public/og,
// and src/data/images.json (dimensions, available widths and a content version `v`, read by
// src/components/Img.astro). The server lets browsers keep images for a day, so a replaced master
// gets a new `v` and with it new URLs (?v=...); otherwise visitors would keep seeing the old image.
// The results are committed, so the production build needs neither sharp nor this script.
// Run `npm run images` after adding or replacing a master.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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
    const top = Math.min(meta.width, widths.at(-1));
    const use = widths.filter((w) => w < top);
    use.push(top);
    for (const w of use) await variant(src, path.join(OUT, `${name}-${w}.webp`), w, q);
    const v = crypto.createHash('sha1').update(fs.readFileSync(src)).digest('hex').slice(0, 8);
    manifest[name] = { width: meta.width, height: meta.height, widths: use, v };
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
