# Change Log

All notable changes to the "vscode-file-extra" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Added

- Adding `npm run clean` to remove repository artifacts

### Fixed

- Fixing File methods when opening multiple workspaces
- Fixing File Name methods (Copy, Copy Relative path, etc.) when opening multiple workspaces
- Fixing folder addition when file is not hidden or doesn't have any extension

## [2.2.0][] - 2020-04-23

## Added

- Adding `CONTRIBUTING.md` docs
- Bumping dependencies to the latest version
- Upgrading NodeJS to v10.20.1

## [2.0.0][] - 2019-03-23

## Fix

- Changing keybindings to avoid conflict with default VSCode aliases

## [1.3.0][] - 2019-03-22

## Added

- Keybindings for fileExtra events

## Updated

- Updated keybindings

## [1.2.0][] - 2019-03-19

## Added

- Added unit tests for proxyquire
- Support copy file name

## Updated

- Disabling extensions when running tests via editor

## [1.1.3][] - 2019-03-17

## Fixed

- Fixing Build task in CI

## [1.1.2][] - 2019-03-17

## Fixed

- Fixing Build task in CI

## [1.1.1][] - 2019-03-17

## Fixed

- Fixing Test task in CI

## Added

- Adding CHANGELOG automation
- Adding link for page in VSCode Marketplace

## [1.1.0][] - 2019-03-17

### Updated

- Decreased bundle size of the extension

## [1.0.0][] - 2019-03-17

### Added

- Support for add file or folder
- Support for rename file or folder
- Support for remove file or folder
- Support for duplicate file or folder
- Support for copy file path
- Support for copy relative file path
- Adding Cross platform CI with Travis-CI and Appveyor

[unreleased]: https://github.com/willmendesneto/vscode-file-extra/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/willmendesneto/vscode-file-extra/tree/v1.1.1
[unreleased]: https://github.com/willmendesneto/vscode-file-extra/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/willmendesneto/vscode-file-extra/tree/v1.1.2
[unreleased]: https://github.com/willmendesneto/vscode-file-extra/compare/v1.1.3...HEAD
[1.1.3]: https://github.com/willmendesneto/vscode-file-extra/tree/v1.1.3
[unreleased]: https://github.com/willmendesneto/vscode-file-extra/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/willmendesneto/vscode-file-extra/tree/v1.2.0
[unreleased]: https://github.com/willmendesneto/vscode-file-extra/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/willmendesneto/vscode-file-extra/tree/v1.3.0
[unreleased]: https://github.com/willmendesneto/vscode-file-extra/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/willmendesneto/vscode-file-extra/tree/v2.0.0
[unreleased]: https://github.com/willmendesneto/vscode-file-extra/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/willmendesneto/vscode-file-extra/tree/v2.2.0
