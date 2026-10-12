# SMK Lab

Independent parent site for ChanceTheMaker's SMK-37 projects. Live site: https://chancethemaker.github.io/smklab/

## Local preview

- URL: http://127.0.0.1:8788
- Build: `node build.mjs`
- Serve: `node server.mjs`
- No npm dependencies. The static publish directory is `dist/`.
- This is a separate local folder, not a branch or change in a firmware repository. No firmware binaries or device access are included. GitHub Pages publishes the gh-pages branch.

## Collection

Felucca SMK and Sloop SMK each link to their public homepage, installer section, Studio, simulator, and source. Melodee SMK links to its public browser preview, Studio, Simulator and source; its hardware port remains in development. Versions are deliberately omitted so the hub does not advertise a stale firmware build.

Edit `src/firmwares.json` and run the build to add approved projects. Active entries require id, name, description, HTTPS url, and a status of beta, released or preview. Browser-only previews use status preview and do not advertise firmware installation. Planned entries use status planned. Optional fields: short, eyebrow, tags, source, upstream, studio, simulator, install, art, screenshot. Artwork/screenshots live under `dist/assets/`. Generic external resources do not need Studio/simulator/install links. Add explicit links only when they exist.

Page copy lives in `src/index.template.html`. Styles, client behavior, and credits are maintained directly in `dist/style.css`, `dist/app.js`, and `dist/credits.html`; the build regenerates only index.html. The three-channel decorative patch bay and hero selector are authored in the template; update those if the featured lineup changes.

## Site submissions and approval

1. Visitors open **Submit a site**, fill in project details, and choose **Continue to GitHub**.
2. The form opens a draft issue in ChanceTheMaker/smklab titled **[SMK Lab submission] Project name**. Visitors must sign in and post the issue themselves. Nothing is silently submitted.
3. Chance reviews project identity, links, supported hardware, status, and descriptions. Submission is never automatic publication. Requests are public; the form warns visitors not to include private information.
4. To approve a listing, add its reviewed data to src/firmwares.json, add licensed artwork if appropriate, run node build.mjs, review the resulting page, then publish the hub. Close/reply to the issue through the normal maintainer workflow. No bot currently acts on labels or comments.
5. To reject a request, do not add it to the registry.

The review destination is the REVIEW_QUEUE constant in dist/app.js. The dedicated ChanceTheMaker/smklab repository owns the review queue. Change REVIEW_QUEUE and these queue references together if the destination changes. No GitHub credentials or backend secrets are stored in the hub.

## Verification

- Built locally; static homepage returns HTTP 200.
- Desktop and phone layout inspected in Chrome; hero selector, dialog, required fields, and close behavior checked.
- Submission URL assembly checked locally with a mock DOM: actual Markdown line breaks, correctly encoded title/body, and unsafe URL schemes rejected. No test issues posted.
- Browser review requests require a GitHub account. No anonymous inbox/backend is included.
- GitHub Pages deployment verified at https://chancethemaker.github.io/smklab/. Live homepage and submission dialog checked in Chrome with no console errors.
- Sibling destination paths match their repository READMEs; local asset HTTP checks pass.

## Credits and license

Created for Chance Roth (@ChanceTheMaker). Artwork and screenshots adapted from Felucca SMK, Sloop SMK and Melodee SMK. Credits acknowledge Felucca by Leo Kuroshita / Hügelton Instruments, Sloop by isod89, and Melodee by keremimo. GPL-3.0 site license and redistributed font licenses are included; see dist/credits.html.

The hub adds no analytics and requests no MIDI access. The linked websites keep their own privacy behavior.

## Publishing

Run `node build.mjs`, commit the source on main, then use `git subtree split --prefix=dist -b gh-pages` to generate the static publishing branch. Push main and gh-pages to https://github.com/ChanceTheMaker/smklab.git. For later updates, split to a commit (`git subtree split --prefix=dist`), then push that commit to gh-pages without force; it should descend from the previous split. Pages serves gh-pages at its root.
