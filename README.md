# Coverd website

Static site for Coverd AG, built with [Astro](https://astro.build). German at `/`, English at `/en/`.

| Branch | Where it runs |
|---|---|
| `staging` | https://staging.coverd.ch, password protected, deployed about two minutes after each push |
| `main` | https://coverd.ch and GitHub Pages. This is still the old single-file site, see [docs/go-live.md](docs/go-live.md) |

## Working on it

```sh
npm ci
npm run dev     # http://127.0.0.1:4321
npm run build   # output in dist/
```

## Where things are

| Path | What |
|---|---|
| `src/data/site.ts` | Every company fact the site states: contact details, register data, FINMA status, booking links |
| `src/i18n.ts` | URLs per language and the strings shared across pages |
| `src/views/` | One file per page, holding its German and English copy side by side |
| `src/pages/` | Thin routing files: one per URL, each renders a view |
| `src/content/blog/{de,en}/` | Blog posts in Markdown. `translationKey` links the two language versions |
| `src/data/insurances.ts` | The insurance directory |
| `src/styles/global.css` | The design system |
| `assets/` | Image masters. The generated files in `public/img` and `public/og` come from these |

## Adding an image

Put the master in `assets/photos/` (JPEG, at least 1600px wide), run `npm run images`, and commit the
results. Then use it with `<Img name="file-name" alt="..." sizes="..." />`. Every image needs a real
`alt` text in both languages, unless it is purely decorative.

## Hero video (off for now)

The homepage hero shows the still photo. A video version (a looping cinemagraph of the bridge) was taken
off on 2026-11-03. Commit `81f73da` has everything to bring it back: the markup, styles, the encoded
videos (`public/video/`), `scripts/hero-video.sh` and the freeze mask (`assets/video/`). The script
documents the fal.ai prompt and caps ffmpeg's memory, because an uncapped run took the shared server
down. The 4K source clip was deleted on 2026-11-06; re-encoding needs a new clip.

## Type

Headlines, quotes and large numbers use Newsreader (serif), everything else Schibsted Grotesk. Both are
self-hosted in `public/fonts`.

## Adding a blog post

Add `src/content/blog/de/<slug>.md` and `src/content/blog/en/<slug>.md` with the same `translationKey`,
copying the frontmatter of an existing post. Add a matching entry to `postCta` in `src/lib/blog.ts`.
