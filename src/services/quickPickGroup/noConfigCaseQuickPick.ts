import * as vscode from 'vscode';
import { baseQuickPick } from './baseQuickPick';
import { CommonParams } from '../../types';
import { testContent } from '../../constants/template';
import * as fs from 'fs';

interface NoConfigPickOption {
    label: string;
    value: () => void;
}
interface NoConfigCaseQuickPickParams extends CommonParams {
    context: vscode.ExtensionContext;
}

export async function noConfigCaseQuickPick({
    workspaceFolder,
    resourceControl,
}: NoConfigCaseQuickPickParams) {
    const workSpacePath = workspaceFolder.uri.path;
    const { createFolder, createFile, getResourcePath } = resourceControl;

    const noConfigPickOptions: NoConfigPickOption[] = [
        {
            label: 'make example folder structure',
            value: () => {
                const folderPath = getResourcePath([workSpacePath, 'exampleFolder']);
                const filePath = getResourcePath([folderPath, 'Test.tsx']);
                const fileContent = testContent;

                createFolder(folderPath);
                createFile(filePath, fileContent);

                vscode.window.showInformationMessage('the example folder is created successfully');
            },
        },
        {
            label: 'make example config',
            value: () => {
                const folderPath = getResourcePath([workSpacePath, 'asfg.config']);

                fs.cp(
                    '../../constants/template/asfg.config.example',
                    folderPath,
                    { recursive: true },
                    err => {
                        console.log('복사 실패');
                    }
                );
                //config 컨셉
                // 1. 객체로 되어있고, value는 Structure 객체 혹은 Structure[]
                // 2. Structure은 structurePath:string, creatingPath:string 존재
                // 3. structurePath는 무조건 asfg.config를 기준으로 찾는다.
            },
        },
    ];

    baseQuickPick({ optionItems: noConfigPickOptions });
}
