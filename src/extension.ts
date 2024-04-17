import * as vscode from 'vscode';
import { ResourceControl } from './modules';
import { asfgQuickPick, snippet } from './services';
import { BaseParams, CommandHandlerArgs } from './types';
import { MessageControl } from './modules/messageControl';

export function activate(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return vscode.window.showErrorMessage('please open your workspace first');
    }
    const workspaceFolder = workspaceFolders[0];
    const messageControl = new MessageControl();
    const resourceControl = new ResourceControl(workspaceFolder, messageControl);

    const baseParams: Omit<BaseParams, 'commandHandlerArgs'> = {
        context,
        workspaceFolder,
        resourceControl,
        messageControl,
    };

    context.subscriptions.push(vscode.commands.registerCommand('asfg', getAsfgHandler(baseParams)));
    context.subscriptions.push(vscode.commands.registerCommand('snippet', getSnippetHandler(baseParams)));
}

/**
 * @helpers
 */

function getAsfgHandler(baseParams: BaseParams) {
    return (commandHandlerArgs?: CommandHandlerArgs) => {
        const { resourceControl } = baseParams;
        const _commonParams = { commandHandlerArgs, ...baseParams };

        if (!resourceControl?.isResourceExistFromRoot('asfg.config')) {
            asfgQuickPick.noConfigCaseQuickPick(_commonParams);
        } else {
            asfgQuickPick.configExistQuickPick(_commonParams);
        }
    };
}

function getSnippetHandler(baseParams: BaseParams) {
    return () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const _commonParams = { editor, ...baseParams };
            snippet.createSnippetInput(_commonParams);
        }
    };
}
