# Going live

`staging` is not ready to merge into `main` until the items below are done. `main` deploys straight to
coverd.ch, and the deploy script expects a plain `index.html` in the repository root, so an unprepared
merge would fail the deploy and leave coverd.ch on the old site.

## Facts to confirm

Everything here goes into `src/data/site.ts`. Empty fields are simply not shown.

- [ ] **FINMA registration: launch blocker.** The FINMA statements are switched on ahead of the
      registration, while the site is behind its password. On 2026-10-30 the public register returned
      nothing for "Coverd" or "Krapl". Do not launch until the entry is visible there. Add `finma.number`.
- [ ] **Ombudsman** (`ombudsman`), if one applies to Coverd as an intermediary.
- [ ] **Commercial register.** Coverd AG was not found in Zefix on 2026-10-30. Add `address`, `uid`,
      `registerOffice` and `boardMembers`. The legal notice needs them.
- [ ] **Phone number** (`phone`), once one is fixed.
- [ ] **Booking links** per topic (`booking`), if topic-specific Google Calendar schedules are created.

## Content to review

- [ ] Legal review of `src/views/Impressum.astro` and `src/views/Datenschutz.astro`.
- [ ] Information duties for intermediaries under Art. 45 VAG: check what must be handed over and where.
- [ ] BVG minimum interest rate 2027: the Bundesrat had not decided on 2026-10-30. Update the table and
      text in the blog post on the 2027 figures once it has. The rest of that post was checked against
      the Bundesrat release of 2026-10-02 and the BSV on that date. Its wording on the vote of
      29 November also needs updating after the vote.
- [ ] Portal: the copy describes it as available, while the login links stay disabled with a badge.
      Make these match before launch: either the portal is live, or the copy changes.
- [ ] Surname and LinkedIn profile for Dominique in `src/data/team.ts`.
- [ ] Higher resolution portraits for Luca, Nicolas and Dominique. Current files are about 300px wide.
- [ ] Decide whether the contact form should deliver enquiries directly. It currently opens the visitor's
      email program, because a static site has no mail backend. Delivering directly needs a mail provider.

## Server changes on dev2

1. Change `/usr/local/bin/coverd-web-deploy` to build like `/usr/local/bin/coverd-staging-deploy`, or
   point `coverd.ch` at a build of `main` by other means. Add the same resource limits to its unit.
2. In `/etc/apache2/snippets/coverd-web-site.conf`, delete the preview gate lines, the `/_login/` and
   `/_dologin` blocks and `X-Robots-Tag`. Add `ErrorDocument 404 /404.html`.
3. Redirect the old portal files, for example
   `RedirectMatch 301 ^/kundenportal-(privat|kmu)\.html$ /`.
4. Merge `staging` into `main`.
5. Turn off GitHub Pages for the repository. It needs admin rights on `jankrapl/covert-ag-website`, and
   it would otherwise keep publishing from `main`.
6. Submit `https://coverd.ch/sitemap-index.xml` in Google Search Console.
