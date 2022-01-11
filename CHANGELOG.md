## [v1.4.3] - 2022-01-11

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.4.3) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.4.2...v1.4.3) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.4.3) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.4.3.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.4.3.tar.gz))

### Interface changes

- [`3d0215f`](https://github.com/betahuhn/webcrate/commit/3d0215f)  Add small WebCrate icon to the favicon on link pages

### Bug fixes

- [`c5a318d`](https://github.com/betahuhn/webcrate/commit/c5a318d)  Prevent modal from closing when trying to move a link #54
(Issues: [`#54`](https://github.com/betahuhn/webcrate/issues/54))- [`68ab7ce`](https://github.com/betahuhn/webcrate/commit/68ab7ce)  Handle image loading race condition
- [`59c1d87`](https://github.com/betahuhn/webcrate/commit/59c1d87)  Make sure notification is above modal
- [`56956eb`](https://github.com/betahuhn/webcrate/commit/56956eb)  Handle all image erros on the frontend and prevnt fallback from being shown

### Dependency updates

- [`3e84782`](https://github.com/betahuhn/webcrate/commit/3e84782)  Upgrade dependencies

## [v1.4.2] - 2021-12-01

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.4.2) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.4.1...v1.4.2) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.4.2) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.4.2.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.4.2.tar.gz))

### Updates

- [`bbfcae5`](https://github.com/betahuhn/webcrate/commit/bbfcae5)  Store image mode on a per crate basis
- [`d86882d`](https://github.com/betahuhn/webcrate/commit/d86882d)  Simplify dropdown actions

### Interface changes

- [`a772b0c`](https://github.com/betahuhn/webcrate/commit/a772b0c)  Improved image display with loader and better resizing
- [`6f99958`](https://github.com/betahuhn/webcrate/commit/6f99958)  Use same style for button

### Bug fixes

- [`7f53d71`](https://github.com/betahuhn/webcrate/commit/7f53d71)  Handle auth errors with axios interceptor
- [`a8578f3`](https://github.com/betahuhn/webcrate/commit/a8578f3)  Prevent image from being stretched on mobile

## [v1.4.1] - 2021-11-01

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.4.1) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.4.0...v1.4.1) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.4.1) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.4.1.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.4.1.tar.gz))

### Bug fixes

- [`9a0b624`](https://github.com/betahuhn/webcrate/commit/9a0b624)  Don&#x27;t open link in new tab on normal click
- [`9261f4d`](https://github.com/betahuhn/webcrate/commit/9261f4d)  Prevent changelog from showing up after onboarding
- [`72aaf66`](https://github.com/betahuhn/webcrate/commit/72aaf66)  Prevent overflow on copy output modal

## [v1.4.0] - 2021-10-21

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.4.0) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.3.0...v1.4.0) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.4.0) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.4.0.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.4.0.tar.gz))

### New features

- [`ef428d9`](https://github.com/betahuhn/webcrate/commit/ef428d9)  Full screen link page
- [`57711f6`](https://github.com/betahuhn/webcrate/commit/57711f6)  Replace redirects with link page sharing
- [`c80c4bd`](https://github.com/betahuhn/webcrate/commit/c80c4bd)  Use middle click to open links and crates in new tab
- [`ada1579`](https://github.com/betahuhn/webcrate/commit/ada1579)  Fullscreen image modal
- [`8502e63`](https://github.com/betahuhn/webcrate/commit/8502e63)  Support links in notes editor (tiptap)

### Interface changes

- [`64aad4a`](https://github.com/betahuhn/webcrate/commit/64aad4a)  Show image toggle on public and external crates
- [`6057621`](https://github.com/betahuhn/webcrate/commit/6057621)  Allow horizontal resizing of image in link page

### Bug fixes

- [`aaf26fd`](https://github.com/betahuhn/webcrate/commit/aaf26fd)  Show correct version in help menu for public crates

## [v1.3.0] - 2021-09-21

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.3.0) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.2.0...v1.3.0) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.3.0) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.3.0.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.3.0.tar.gz))

### New features

- [`e58f99e`](https://github.com/betahuhn/webcrate/commit/e58f99e)  Add rich text editor to customize the link description
- [`3dc77db`](https://github.com/betahuhn/webcrate/commit/3dc77db)  Add image list view and stack items #31
(Issues: [`#31`](https://github.com/betahuhn/webcrate/issues/31))

### Interface changes

- [`1d7c7f8`](https://github.com/betahuhn/webcrate/commit/1d7c7f8)  Use check icon for change name button (#40)
(Issues: [`#40`](https://github.com/betahuhn/webcrate/issues/40) [`#38`](https://github.com/betahuhn/webcrate/issues/38))- [`4dffb1d`](https://github.com/betahuhn/webcrate/commit/4dffb1d)  Add custom error page
- [`0bbd802`](https://github.com/betahuhn/webcrate/commit/0bbd802)  Show loading indicator while adding link

### Bug fixes

- [`facd658`](https://github.com/betahuhn/webcrate/commit/facd658)  Display all crates in the sidebar (closes #39)
(Issues: [`#39`](https://github.com/betahuhn/webcrate/issues/39))

## [v1.2.0] - 2021-09-07

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.2.0) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.1.0...v1.2.0) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.2.0) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.2.0.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.2.0.tar.gz))

### New features

- [`2645bd5`](https://github.com/betahuhn/webcrate/commit/2645bd5)  Support bulk importing of existing links via API

### Interface changes

- [`4486035`](https://github.com/betahuhn/webcrate/commit/4486035)  Check if update available and show indicator in help menu

### Bug fixes

- [`3c875df`](https://github.com/betahuhn/webcrate/commit/3c875df)  Prevent edit request for link details in external crate
- [`5de5423`](https://github.com/betahuhn/webcrate/commit/5de5423)  Fix moving links between crates and add success notification

## [v1.1.0] - 2021-08-30

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.1.0) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.0.2...v1.1.0) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.1.0) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.1.0.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.1.0.tar.gz))

### New features

- [`3c1884a`](https://github.com/betahuhn/webcrate/commit/3c1884a)  Optionally add a custom title during link creation #27
(Issues: [`#27`](https://github.com/betahuhn/webcrate/issues/27))

### Interface changes

- [`edb91e8`](https://github.com/betahuhn/webcrate/commit/edb91e8)  Show emoji in crate dropdown

### Bug fixes

- [`9bb1dc8`](https://github.com/betahuhn/webcrate/commit/9bb1dc8)  Add links to the top of a crate
- [`dcd9e6d`](https://github.com/betahuhn/webcrate/commit/dcd9e6d)  Prevent share modal from closing itself accidentally

## [v1.0.2] - 2021-08-24

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.0.2) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.0.1...v1.0.2) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.0.2) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.0.2.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.0.2.tar.gz))

### Interface changes

- [`3f0cf12`](https://github.com/betahuhn/webcrate/commit/3f0cf12)  Add logo to sidebar

### Bug fixes

- [`7b929cc`](https://github.com/betahuhn/webcrate/commit/7b929cc)  Use different UA when scraping Twitter URL and add title fallback

## [v1.0.1] - 2021-08-24

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.0.1) · [Compare](https://github.com/betahuhn/webcrate/compare/v1.0.0...v1.0.1) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.0.1) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.0.1.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.0.1.tar.gz))

### Bug fixes

- [`bd7bc76`](https://github.com/betahuhn/webcrate/commit/bd7bc76)  Use correct path to templates in prod
- [`0d654ba`](https://github.com/betahuhn/webcrate/commit/0d654ba)  Fix modal being triggered accidentally
- [`dba570f`](https://github.com/betahuhn/webcrate/commit/dba570f)  Use inputs instead of contenteditable

## [v1.0.0] - 2021-08-23

[Release notes](https://github.com/betahuhn/webcrate/releases/tag/v1.0.0) · [Tag](https://github.com/betahuhn/webcrate/tree/v1.0.0) · Archive ([zip](https://github.com/betahuhn/webcrate/archive/v1.0.0.zip) · [tar.gz](https://github.com/betahuhn/webcrate/archive/v1.0.0.tar.gz))

### New features

- [`5d925a7`](https://github.com/betahuhn/webcrate/commit/5d925a7)  Dynamic meta tags for public crates
- [`0aaac65`](https://github.com/betahuhn/webcrate/commit/0aaac65)  Generate dynamic social previews
- [`bc783f2`](https://github.com/betahuhn/webcrate/commit/bc783f2)  Detect when a external crate is unavailable
- [`4a708bf`](https://github.com/betahuhn/webcrate/commit/4a708bf)  Add features to welcome screen
- [`151cdb8`](https://github.com/betahuhn/webcrate/commit/151cdb8)  Add empty state to index page
- [`345c28b`](https://github.com/betahuhn/webcrate/commit/345c28b)  Add external crate explation on empty state

### Interface changes

- [`f3e2ee4`](https://github.com/betahuhn/webcrate/commit/f3e2ee4)  Add blurred icon background effect to crate menu items
- [`45f0e81`](https://github.com/betahuhn/webcrate/commit/45f0e81)  Add hover effect to crate item dropzone
- [`d9e8785`](https://github.com/betahuhn/webcrate/commit/d9e8785)  Change headline color

### Bug fixes

- [`5504572`](https://github.com/betahuhn/webcrate/commit/5504572)  Try to prevent modal close from triggering element below on mobile
- [`146ec1b`](https://github.com/betahuhn/webcrate/commit/146ec1b)  Fix addLink modal not closing
- [`61839d1`](https://github.com/betahuhn/webcrate/commit/61839d1)  Fix onboarding links

### Dependency updates

- [`a9f8a67`](https://github.com/betahuhn/webcrate/commit/a9f8a67)  Upgrade dependencies
