# SMK Lab

Independent parent site for ChanceTheMaker's SMK-37 projects. Live site: https://chancethemaker.github.io/smklab/

## Local preview

- URL: http://127.0.0.1:8788
- Build: `node build.mjs`
- Serve: `node server.mjs`
- No npm dependencies. The static publish directory is `dist/`.
- This is a separate local folder, not a branch or change in a firmware repository. No firmware binaries or device access are included. GitHub Pages publishes the gh-pages branch.

## Collection

Felucca SMK and Sloop SMK each link to their public homepage, installer section, Studio, simulator, and source. Melodee SMK links to its experimental beta installer, Studio, Simulator and source. Doom FM-1 / SMK links to its homepage, installer, published browser simulator and source. GameDude and GameDude Color link to their browser players, FM-1 / SMK firmware installers, Bluetooth / USB game loaders and source. Both listings include current solid italic wordmarks, actual homebrew gameplay, enlarged display insets and FM-1 / SMK-37 Pro / Elite artwork. NESynth links to its NES/ZIP browser player, homebrew games, FM-1 firmware builder and USB installer, and source. Its card uses the red oval logo and an SMK illustration displaying CodeMaster. SMK37 simulators and development builds are available. Each keyboard illustration links to its project homepage. All sites include a shared family navigation section. Version labels are included for verified releases and must be updated alongside their linked installer. All seven firmware cards show compact release labels below their titles; keep separate SMK and FM-1 build numbers where they differ. GameDude, Color and NESynth SMK artwork uses the firmware mapping: cyan Up/Left/Down/Right and magenta B/A. Run `python tools/light_game_pads.py` after artwork changes; the GameDude art sync also applies this lighting.

Edit `src/firmwares.json` and run the build to add approved projects. Active entries require id, name, description, HTTPS url, and a status of beta, released or preview. Browser-only previews use status preview and do not advertise firmware installation. Planned entries use status planned. Optional fields: version, short, eyebrow, tags, source, upstream, studio, simulator, install, art, screenshot, logo, hero, heroAlt, artAlt, games, game, previewDescription, screenshotAlt and gallery (file/label pairs). Artwork/screenshots live under `dist/assets/`. Generic external resources do not need Studio/simulator/install links. Add explicit links only when they exist.

Page copy lives in `src/index.template.html`. Styles, client behavior, and credits are maintained directly in `dist/style.css`, `dist/app.js`, and `dist/credits.html`; the build regenerates only index.html. The hero slideshow is generated from active registry entries, starting with GameDude Color and crossfading every five seconds. It pauses while the page is hidden or a hero link has keyboard focus; reduced-motion preferences disable the fade. The decorative patch bay remains in the template.

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

The Doom card uses the black SMK-37 SVG layout with an embedded 240px combat screenshot from `doom-fm1-smk/site/screenshots/combat.png`. The image is embedded so it renders reliably inside an SVG used as an image. Miniwad/Freedoom notices are retained under `dist/assets/licenses/`.

## GameDude artwork

`tools/sync_gamedude_art.py` reads the sibling GameDude project artwork and current wordmarks, embeds the captured 160×144 homebrew screens into all three devices, and generates enlarged collection-card display insets. It finds the FM1-SMK workspace by its GameDude-RGB folder. Run it with Python, then rebuild. The browser screenshots show Breakout (Fabien Loison, WTFPL-2.0) and Flooder (Oliver Balfour, MIT); their notices are in dist/assets/licenses. Screens were captured during gameplay in the respective browser players. No commercial ROM artwork or game binaries are included in this hub.

Doom release 24 uses `dist/assets/doom-smk-black-24.svg`: the existing illustration and embedded gameplay screen with only the eight mapped pads illuminated. The five-second crossfade is unchanged.

Felucca uses the ported FM-1 upstream version in its public label (currently v1.6.1), with the SMK build listed separately. Doom uses the product version v0.9, with SMK build 24 and FM-1 build 26 shown separately. These SMK-LAB display labels do not alter USB updater identities.
