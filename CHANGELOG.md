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
