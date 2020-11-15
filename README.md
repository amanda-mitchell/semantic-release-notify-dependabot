# @amanda-mitchell/semantic-release-notify-dependabot

This is a plugin for [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) that notifies Dependabot of package updates in private registries.

## Installation

```
yarn add --dev @amanda-mitchell/semantic-release-notify-dependabot
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@amanda-mitchell/semantic-release-notify-dependabot"
  ]
}
```

## Configuration

By default, this plugin will assume that you are publishing an npm package and will inspect the `package.json` in the current working directory for the package name.

### Authentication

Authentication configuration is **required** and can be set via [environment variables](#environment-variables).

Dependabot uses GitHub personal access tokens for authentication ([docs](https://github.com/dependabot/api-docs#authentication)). This plugin will use `DEPENDABOT_TOKEN` if it is set, but will fall back to either `GITHUB_TOKEN` or `GH_TOKEN` if it is missing.

### Environment variable

| Variable                                          | Description                                                   |
| ------------------------------------------------- | ------------------------------------------------------------- |
| `DEPENDABOT_TOKEN`, `GITHUB_TOKEN`, or `GH_TOKEN` | **Required.** The token used to authenticate with Dependabot. |

### Options

| Option           | Description                                                                                                                                                                                                                                                                                                                                           | Default                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `packageManager` | The package manager to which this package belongs. At the time of this writing, must be one of `bundler`, `composer`, `docker`, `maven`, `npm_and_yarn`, `elm`, `submodules`, `hex`, `cargo`, `gradle`, `nuget`, `dep`, `go_modules`, `pip`, `terraform` or `github_actions` (From the [Dependabot API docs](https://github.com/dependabot/api-docs)) | `npm_and_yarn`                        |
| `packageRoot`    | The directory holding the `package.json` for this package. (Ignored unless `packageManager` is `npm_and_yarn`)                                                                                                                                                                                                                                        | Current working directory.            |
| `packageName`    | The package name that should be sent to Dependabot.                                                                                                                                                                                                                                                                                                   | The `name` field from `package.json`. |
