import * as vscode from 'vscode';

import { baseQuickPick } from './baseQuickPick';
import { CommonParams } from '../../types';
import * as contants from '../../constants';

interface NoConfigPickOption {
    label: string;
    value: () => void;
}
interface NoConfigCaseQuickPickParams extends CommonParams {}

export async function noConfigCaseQuickPick({
    context,
    workspaceFolder,
    resourceControl,
}: NoConfigCaseQuickPickParams) {
    const extensionPath = context.extensionPath;
    const workSpacePath = workspaceFolder.uri.path;
    const exampleResourceTemplatePath = 'src/constants/template';

    const {
        isResourceExistFromRoot,
        createFolder,
        createFile,
        copyResource,
        getResourcePath,
        insertContent,
        readResource,
    } = resourceControl;

    const noConfigPickOptions: NoConfigPickOption[] = [
        {
            label: 'make example folder structure',
            value: () => {
                const folderPath = getResourcePath([workSpacePath, 'exampleFolder']);
                const exampleFolderStructureContentPath = getResourcePath([
                    extensionPath,
                    exampleResourceTemplatePath,
                    'folderStructure.example',
                ]);

                // 기본 folder structure 및 file 생성
                createFolder(folderPath);
                copyResource({
                    source: exampleFolderStructureContentPath,
                    destination: folderPath,
                });

                vscode.window.showInformationMessage('the example folder is created successfully');
            },
        },
        {
            label: 'make example config',
            value: () => {
                // 1. asfg.config folder 생성
                const asfgConfigFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
                createFolder(asfgConfigFolderPath);

                // 2. example file 복사
                const exampleConfigStructurePath = getResourcePath([
                    extensionPath,
                    exampleResourceTemplatePath,
                    'asfg.config.example',
                ]);
                copyResource({
                    source: exampleConfigStructurePath,
                    destination: asfgConfigFolderPath,
                });

                // 3. .gitignore에 등록
                const gitignoreFilePath = getResourcePath([workSpacePath, '.gitignore']);

                if (!isResourceExistFromRoot('.gitignore')) {
                    createFile(gitignoreFilePath, contants.exampleGitignoreContent);
                } else {
                    const gitignore = readResource(gitignoreFilePath);

                    if (!gitignore?.includes('asfg.config')) {
                        insertContent(gitignoreFilePath, contants.exampleGitignoreContent);
                    }
                }

                vscode.window.showInformationMessage(
                    'the example asfg.config is created successfully'
                );
            },
        },
    ];

    baseQuickPick({ optionItems: noConfigPickOptions });
}
