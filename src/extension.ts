import * as vscode from 'vscode';
import { ResourceControl, WorkspaceState } from './modules';
import { workspaceEnums } from './constants/workspace';
import { quickPickGroup } from './libs';
import { CommonParams } from './types';

export function activate(context: vscode.ExtensionContext) {
    const commandName = 'asfg';

    const commandHandler = () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (workspaceFolders) {
            const workSpace = workspaceFolders[0];

            const commonWorkspaceState = new WorkspaceState(
                context,
                workspaceEnums.commonState
            ) as CommonParams['commonWorkspaceState'];
            const resourceControl = new ResourceControl(workSpace);

            commonWorkspaceState.setWorkspaceState({ workSpace });

            const commonParams: CommonParams = {
                context,
                commonWorkspaceState,
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

/**
 * helpers
 */
