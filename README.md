# Digital Paper Obsidian Plugin (Beta)

Ever find yourself deleting whatever you write as soon as you type it out? I certainly do.

This plugin aims to solve that by disabling all the delete functions (backspace, delete key, Ctrl+x) in Obsidian. Anything you write will stay there, giving it the kind of permanence akin to writing with a pen on paper.

The goal isn't to get perfect, typo-free writing on the first try, but rather to be accepting of flaws, so you can focus on getting the ideas down first, and only then do some editing in a later pass.

> IMPORTANT: This plugin is still in its early stages, and any bugs can lead to data loss. Please ensure that you are taking regular backups of your vault and use this plugin at your own risk. 

## Usage

Enable / Disable the "paper mode" by opening the command palette (Ctrl+P) and typing "digital paper: Toggle digital paper mode". 

When enabled, Obsidian's status bar will display the text "paper". 

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.


## API Documentation

See https://github.com/obsidianmd/obsidian-api
