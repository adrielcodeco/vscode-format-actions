/* eslint-disable @typescript-eslint/no-floating-promises */
import * as vscode from 'vscode'
import { ExtensionsLogging } from 'vscode-extensions-logging'

const EXTENSION_ID = 'formact'
const languagesConfigKey = `${EXTENSION_ID}.languages`
const actionsConfigKey = `${EXTENSION_ID}.actions`
const defaultFormatterKey = 'editor.defaultFormatter'

export function activate (context: vscode.ExtensionContext) {
  try {
    const logger = ExtensionsLogging.register(EXTENSION_ID)
    logger.info('initializing extension')
    const languages = vscode.workspace.getConfiguration().get<string[]>(languagesConfigKey) ?? [
      'javascript',
      'typescript',
      'json',
      'jsonc',
    ]
    const defaultActions = vscode.workspace.getConfiguration().get<string[]>(actionsConfigKey)
    for (const language of languages) {
      const actions =
        vscode.workspace
          .getConfiguration('', { languageId: language })
          .get<string[]>(actionsConfigKey) ?? defaultActions
      if (actions?.length) {
        logger.info(`registering formatting provider for "${language}" language`)
        vscode.languages.registerDocumentFormattingEditProvider(language, {
          async provideDocumentFormattingEdits (): Promise<vscode.TextEdit[] | undefined> {
            logger.info(`formatting with ${JSON.stringify(actions)} actions`)
            for (const action of actions) {
              try {
                await vscode.commands.executeCommand(action)
                logger.info(`action "${action}" executed`)
              } catch (err) {
                logger.error(err)
              }
            }
            logger.info('formatted')
            return undefined
          },
        })
      }
    }
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(e => {
        if (
          e.affectsConfiguration(languagesConfigKey) ||
          e.affectsConfiguration(actionsConfigKey) ||
          e.affectsConfiguration(defaultFormatterKey)
        ) {
          reloadWindow()
        }
      }),
    )
    logger.info('initialized extension')
  } catch (err) {
    console.log(err)
  }
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
