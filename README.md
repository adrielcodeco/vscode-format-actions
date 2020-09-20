<p align="center">
  <img src="icon.png" />
  <h1 align="center">Formact</h1>
  <br />
</p>

VSCode extension to enable run actions when formatting

## Installation

You can install this extension by one of the following options

- Search for `formact` on vscode marketplace
- Launch vscode quick open (Ctrl+p) and paste the following command

  `ext install codeco.formact`

## How to use it _?_

~~After installed, this extension will ask you for how you would like to configure its use.(TODO)~~

Edit the vscode settings to set `codeco.formact` as defaultFormatter and configure what actions will be called when code formatting.

```jsonc
{
  //# for all languages
  "editor.defaultFormatter": "codeco.formact",
  "formact.actions": ["formact.prettier.format", "eslint.executeAutofix"],

  //# for specific language
  "[typescript]": {
    "editor.defaultFormatter": "codeco.formact",
    "formact.actions": ["formact.prettier.format", "eslint.executeAutofix"]
  }
}
```

Also is possible configure the languages used by formact.

```json
{
  "formact.languages": ["javascript", "typescript", "json", "jsonc"]
}
```

In the first example above, when formatting the code, the Prettier action and the Eslint action will be called in sequence.

OBS. 1: `"javascript", "typescript", "json", "jsonc"` are the default languages used by formact

OBS. 2: The Eslint command is added by the `dbaeumer.vscode-eslint` extension and Prettier command is added by the `codeco.formact-prettier` extension.

OBS. 3: Eslint work for default with Javascript files and Typescript if TypeScript is correctly configured inside ESLint. For Eslint command work with other languages like `json` or `jsonc` it need to be configured adding `eslint.validate` to the `.vscode/settings.json` with the languages `["javascript", "typescript", "json", "jsonc"]`

## TODO

Help the users to configure the extension.
