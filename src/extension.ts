import * as vscode from 'vscode';
import { ResourceControl } from './modules';
import { quickPickGroup } from './services';
import { CommonParams } from './types';

export function activate(context: vscode.ExtensionContext) {
    const commandName = 'asfg';

    const commandHandler = () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (workspaceFolders) {
            const workspaceFolder = workspaceFolders[0];
            const resourceControl = new ResourceControl(workspaceFolder);

            const commonParams: CommonParams = {
                context,
                workspaceFolder,
                resourceControl,
            };

            if (!resourceControl.isExistResource('asfg.config')) {
                quickPickGroup.noConfigCaseQuickPick(commonParams);
            } else {
                console.log('exist');
            }
        } else {
            vscode.window.showErrorMessage('please open your workspace first');
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand(commandName, commandHandler));
}
