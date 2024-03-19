import * as vscode from 'vscode';
import { ResourceControl } from './modules';
import { quickPickGroup } from './services';
import { CommonParams, CommandHandlerArgs } from './types';

export function activate(context: vscode.ExtensionContext) {
    const commandName = 'asfg';

    const commandHandler = (commandHandlerArgs?: CommandHandlerArgs) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (workspaceFolders) {
            const workspaceFolder = workspaceFolders[0];

            console.log('workspacefolder is', workspaceFolder);

            const resourceControl = new ResourceControl(workspaceFolder);

            const commonParams: CommonParams = {
                context,
                workspaceFolder,
                resourceControl,
                commandHandlerArgs,
            };

            if (!resourceControl.isResourceExistFromRoot('asfg.config')) {
                quickPickGroup.noConfigCaseQuickPick(commonParams);
            } else {
                quickPickGroup.configExistQuickPick(commonParams);
            }
        } else {
            vscode.window.showErrorMessage('please open your workspace first');
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand(commandName, commandHandler));
}
