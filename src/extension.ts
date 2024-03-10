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

            if (!resourceControl.isResourceExistFromRoot('asfg.config')) {
                quickPickGroup.noConfigCaseQuickPick(commonParams);
            } else {
                console.log('exist');

                //todo
                // 1. config 설정에 따라서 cp하는 로직을 작성해야 하는데 여기서 주의점
                // -a : source부분을 asfg.config 기준에서 시작하게 해야하고
                // -b : 만약 상대방이 이상한 경로를 작성했을 경우, workspace/asfg.config 폴더까지의 경로를 찾아서 그 이후부터의 것으로 source를 사용한다.
                // -c : 만일, ../ 이렇게 상대경로로 시작해서 들어올 경우는, 시작점을 workspace/asfg.config로 하도록 하고, 상대경로 포함 안되어있거나 './'로 현재위치에서 시작할 경우라면 asfg.config를 기준으로 가져가면 된다.
                // -c : destination은 workspace 기준에서 시작하게 해야하고,
            }
        } else {
            vscode.window.showErrorMessage('please open your workspace first');
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand(commandName, commandHandler));
}
