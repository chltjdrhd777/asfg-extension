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

    // enroll command
    pushSubscription(context, 'asfg', getAsfgHandler(baseParams));
    pushSubscription(context, 'register snippet', getRegisterSnippetHandler(baseParams));
    pushSubscription(context, 'apply snippet', getApplySnippetHandler(baseParams));
}

/**
 * @helpers
 */

function pushSubscription(context: vscode.ExtensionContext, command: string, handler: (...args: any) => any) {
    context.subscriptions.push(vscode.commands.registerCommand(command, handler));
}

// asfg
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

// snippet
function getRegisterSnippetHandler(baseParams: BaseParams) {
    return () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const _commonParams = { editor, ...baseParams };
            snippet.registerSnippetInput(_commonParams);
        }
    };
}

function getApplySnippetHandler(baseParams: BaseParams) {
    return () => {
        snippet.applySnippetQuickPick(baseParams);
    };
}
