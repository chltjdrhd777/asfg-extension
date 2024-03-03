import * as vscode from 'vscode';
import { baseQuickPick } from './baseQuickPick';
import { CommonParams } from '../../types';
import { testContent } from '../../constants/template';

interface NoConfigPickOption {
    label: string;
    value: () => void;
}
interface NoConfigCaseQuickPickParams extends CommonParams {
    context: vscode.ExtensionContext;
}

export async function noConfigCaseQuickPick({
    context,
    commonWorkspaceState,
    resourceControl,
}: NoConfigCaseQuickPickParams) {
    const commonState = commonWorkspaceState.getWorkspaceState();
    const { createUri, createUnit8Array, createFolder, createFile } = resourceControl;

    const noConfigPickOptions: NoConfigPickOption[] = [
        {
            label: 'make example folder structure',
            value: () => {
                const folderPath = `${commonState.workSpace.uri.path}/exampleFolder`;
                const filePath = `${folderPath}/Test.tsx`;
                const fileContent = createUnit8Array(testContent);
                const folderUri = createUri(`${commonState.workSpace.uri.path}/exampleFolder`);
                const fileUri = createUri(filePath);

                createFolder(folderUri);
                createFile(fileUri, fileContent);

                vscode.window.showInformationMessage('the example folder is created successfully');
            },
        },
        {
            label: 'make example config',
            value: () => {},
        },
    ];

    baseQuickPick({ optionItems: noConfigPickOptions });
}
