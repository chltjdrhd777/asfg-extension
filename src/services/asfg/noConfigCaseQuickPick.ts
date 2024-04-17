import { baseQuickPick } from './baseQuickPick';
import { BaseParams } from '../../types';
import { createASFGConfigFolder } from './createASFGConfigFolder';

interface NoConfigPickOption {
    label: string;
    value: () => void;
}
interface NoConfigCaseQuickPickParams extends BaseParams {}

export async function noConfigCaseQuickPick(noConfigCaseQuickPickParams: NoConfigCaseQuickPickParams) {
    const {
        workspaceFolder,
        resourceControl: { createFolder, copyResource, getResourcePath },
        messageControl: { showTimedMessage },
    } = noConfigCaseQuickPickParams;
    const workSpacePath = workspaceFolder.uri.path;
    //! note : __dirname = dist
    const exampleResourceTemplatePath = getResourcePath([__dirname, 'constants', 'template']);
    const asfgConfigFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const exampleConfigStructurePath = getResourcePath([exampleResourceTemplatePath, 'asfg.config.example']);

    const noConfigPickOptions: NoConfigPickOption[] = [
        {
            label: 'make example folder structure',
            value: () => {
                const exampleFolderPath = getResourcePath([workSpacePath, 'exampleFolder']);
                const exampleFolderStructureContentPath = getResourcePath([
                    exampleResourceTemplatePath,
                    'folderStructure.example',
                ]);

                // 기본 folder structure 및 file 생성
                createFolder(exampleFolderPath);
                copyResource({
                    source: exampleFolderStructureContentPath,
                    destination: exampleFolderPath,
                });

                showTimedMessage({ message: '🎉 the example folder is created successfully' });
            },
        },
        {
            label: 'make example config',
            value: () => {
                // 1. asfg.config folder 생성 및 .gitignore 등록
                createASFGConfigFolder({ ...noConfigCaseQuickPickParams, logging: false });

                // 2. example file 복사
                copyResource({
                    source: exampleConfigStructurePath,
                    destination: asfgConfigFolderPath,
                });

                showTimedMessage({ message: '🎉 the example asfg.config is created successfully' });
            },
        },
    ];

    baseQuickPick({ optionItems: noConfigPickOptions });
}
