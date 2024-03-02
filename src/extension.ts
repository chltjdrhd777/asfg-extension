import * as vscode from 'vscode';

import { noConfigCaseQuickPick } from './libs';

import { ResourceControl } from './modules/resourceControl';

export function activate(context: vscode.ExtensionContext) {
    const commandName = 'asfg';

    const commandHandler = () => {
        const resourceControl = new ResourceControl();

        const commonParams = {
            context,
            resourceControl,
        } as const;

        if (!resourceControl.isResourceExist('asfg.config')) {
            noConfigCaseQuickPick({ context, resourceControl });
        } else {
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand(commandName, commandHandler));
}
