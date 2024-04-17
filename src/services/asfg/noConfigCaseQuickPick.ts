import * as vscode from 'vscode';

import { baseQuickPick } from './baseQuickPick';
import { BaseParams } from '../../types';
import * as contants from '../../constants';

interface NoConfigPickOption {
    label: string;
    value: () => void;
}
interface NoConfigCaseQuickPickParams extends BaseParams {}

export async function noConfigCaseQuickPick({
    workspaceFolder,
    resourceControl: {
        isResourceExistFromRoot,
        createFolder,
        createFile,
        copyResource,
        getResourcePath,
        insertContent,
        readResource,
    },
    messageControl: { showTimedMessage },
}: NoConfigCaseQuickPickParams) {
    const workSpacePath = workspaceFolder.uri.path;
    //! note : __dirname = dist
    const exampleResourceTemplatePath = getResourcePath([__dirname, 'constants', 'template']);

    const noConfigPickOptions: NoConfigPickOption[] = [
        {
            label: 'make example folder structure',
            value: () => {
                const folderPath = getResourcePath([workSpacePath, 'exampleFolder']);
                const exampleFolderStructureContentPath = getResourcePath([
                    exampleResourceTemplatePath,
                    'folderStructure.example',
                ]);

                // 기본 folder structure 및 file 생성
                createFolder(folderPath);
                copyResource({
                    source: exampleFolderStructureContentPath,
                    destination: folderPath,
                });

                showTimedMessage({ message: '🎉 the example folder is created successfully' });
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

                showTimedMessage({ message: '🎉 the example asfg.config is created successfully' });
            },
        },
    ];

    baseQuickPick({ optionItems: noConfigPickOptions });
}
