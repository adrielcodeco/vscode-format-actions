/* eslint-disable @typescript-eslint/no-floating-promises */
import * as vscode from 'vscode'
import { ExtensionsLogging } from 'vscode-extensions-logging'

const EXTENSION_ID = 'formact'
const languagesConfigKey = `${EXTENSION_ID}.languages`
const actionsConfigKey = `${EXTENSION_ID}.actions`

export function activate (context: vscode.ExtensionContext) {
  const logger = ExtensionsLogging.register(EXTENSION_ID)
  const languages = vscode.workspace.getConfiguration().get<string[]>(languagesConfigKey) ?? [
    'javascript',
    'typescript',
    'json',
  ]
  for (const language of languages) {
    const actions = vscode.workspace
      .getConfiguration('', { languageId: language })
      .get<string[]>(actionsConfigKey)
    if (actions?.length) {
      vscode.languages.registerDocumentRangeFormattingEditProvider(language, {
        async provideDocumentRangeFormattingEdits (): Promise<vscode.TextEdit[] | undefined> {
          for (const action of actions) {
            try {
              await vscode.commands.executeCommand(action)
            } catch (err) {
              logger.error(err)
            }
          }
          return undefined
        },
      })
    }
  }
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (
        e.affectsConfiguration(languagesConfigKey) ||
        languages.find(l => e.affectsConfiguration(actionsConfigKey, { languageId: l }))
      ) {
        reloadWindow()
      }
    }),
  )
}

function reloadWindow () {
  const action = 'Reload'
  vscode.window
    .showInformationMessage(
      'Reload window in order for change in extension `' +
        EXTENSION_ID +
        '` configuration to take effect.',
      action,
    )
    .then(selectedAction => {
      if (selectedAction === action) {
        vscode.commands.executeCommand('workbench.action.reloadWindow')
      }
    })
}
