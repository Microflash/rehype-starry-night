# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.0.0] - 2024-07-27

### Added

- Plugin to soft wrap lines with `wrap` property

### Removed

- **Breaking** `wrap` option to soft wrap the entire codeblock by setting it to `true`

## [5.0.0] - 2024-07-07

### Added

- Annotate added and removed lines
- Conditionally wrap lines
- Annotate lines as command-line output
- Plugin API to enhance header and lines
- Option to disable or override default plugins
- Imports for default plugins
- CSS properties to control more theming for diffs, prompt, and outline
- Graceful fallback behavior when language info is unavailable

### Changed

- **Breaking** Rename `caption` property to `title` for codeblock titles
- **Breaking** Rename `--hl-code-highlight` to `--hl-line-highlight-background-color`

### Removed

- JavaScript based line-number padding; it is now CSS-based
- **Breaking** Header extensions in favor of new title and language plugins

## [4.1.0] - 2024-06-10

### Patched

- Upgrade to `@wooorm/starry-night@3.4.0`

## [4.0.0] - 2024-04-30

### Added

- More concise syntax to inject language information in the inline `code` elements using `remark-inline-code-lang` plugin
- Customizable className prefix for both `rehype-starry-night` and `rehype-starry-night-inline`
- Customizable marker to inject language information for inline `code` element using `remark-inline-code-lang` plugin

### Changed

- **Breaking** Upgrade to [`fenceparser@3.0.0`](https://github.com/Microflash/fenceparser/releases/tag/v3.0.0) which removed the support for specifying the ranges using hyphen (for example, `1-5` is now invalid, you should use `1..5` instead)
- Update [docs with examples](https://github.com/Microflash/rehype-starry-night/blob/v4.0.0/README.md)

### Removed

- **Breaking** `remark-code-directive` plugin is removed in favor of `remark-inline-code-lang` which offers a more concise syntax to inject language information in the inline `code` elements. It also does not require `remark-directive` as a dependency.

## [3.6.0] - 2024-04-13

### Patched

- Upgrade to `@wooorm/starry-night@.3.0`

## [3.5.0] - 2024-01-07

### Added

- Support highlighting inline `code` elements through a custom directive

## [3.2.0] - 2024-01-06

### Patched

- Upgrade to `@wooorm/starry-night@3.2.0`

## [3.1.0] - 2023-12-05

### Patched

- Upgrade to `@wooorm/starry-night@3.1.0`

## [3.0.0] - 2023-09-24

### Added

- Header extension API to customize codeblock headers

### Changed

- **Breaking** Drops support for Node.js versions below 16 (since the underlying dependencies now require Node.js 16)

### Patched

- Upgrade to `@wooorm/starry-night@3.0.0`
- Upgrade to `hast-util-to-string@3.0.0`
- Upgrade to `unist-util-visit@5.0.0`

## [2.1.1] - 2023-05-21

### Changed

- Refactor `index.css` to make it customizable by people using it directly
- Update docs with an example of supporting light and dark themes

### Fixed

- Fix variable in index.css ([#1](https://github.com/Microflash/rehype-starry-night/pull/1)) by [@thor2304](https://github.com/thor2304) 

## [2.1.0] - 2023-05-21

### Added

- CSS to style header and gutter of codefences
- Sample images for various usecases
- Regression tests
- GitHub Actions to run regression automatically

## [2.0.0] - 2023-05-21

### Changed

- Improve line number detection
- Pad line numbers

## [1.0.0] - 2022-12-24

### Added

Syntax highlight plugin with support for following additional features

- line numbers
- line highlights
- support for prompt
- captions and language information

[6.0.0]: https://github.com/Microflash/rehype-starry-night/compare/v5.0.0...v6.0.0
[5.0.0]: https://github.com/Microflash/rehype-starry-night/compare/v4.1.0...v5.0.0
[4.1.0]: https://github.com/Microflash/rehype-starry-night/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/Microflash/rehype-starry-night/compare/v3.6.0...v4.0.0
[3.6.0]: https://github.com/Microflash/rehype-starry-night/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/Microflash/rehype-starry-night/compare/v3.2.0...v3.5.0
[3.2.0]: https://github.com/Microflash/rehype-starry-night/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/Microflash/rehype-starry-night/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/Microflash/rehype-starry-night/compare/v2.1.1...v3.0.0
[2.1.1]: https://github.com/Microflash/rehype-starry-night/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/Microflash/rehype-starry-night/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Microflash/rehype-starry-night/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Microflash/rehype-starry-night/releases/tag/v1.0.0
