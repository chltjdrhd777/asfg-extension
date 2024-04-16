import { window } from 'vscode';

import { baseQuickPick } from './baseQuickPick';
import { BaseParams } from '../../types';

import * as utils from '../../utils';
import * as types from '../../types';
import { CopryResourceParams } from '../../modules/resourceControl';

interface ConfigExistPickOption {
    label: string;
    value: () => void;
}

interface ConfigExistQuickPickParams extends BaseParams {}

export async function configExistQuickPick(configExistQuickPickParams: ConfigExistQuickPickParams) {
    const {
        workspaceFolder,
        resourceControl: { getResourcePath },
    } = configExistQuickPickParams;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const configJsonPath = getResourcePath([configFolderPath, 'config.json']);
    const configJsonData = utils.readConfigJson(configJsonPath);
    const createConfigStructure = (label: string, jsonValue: types.JsonValue) => {
        createStructure({
            label,
            jsonValue,
            ...configExistQuickPickParams,
        });
    };

    const configExistPickOptions: ConfigExistPickOption[] = Object.entries(configJsonData).map(
        ([label, jsonValue]) => ({
            label,
            value: () => {
                try {
                    Array.isArray(jsonValue) // 다중생성구조일 경우,
                        ? jsonValue.forEach(_jsonValue => createConfigStructure(label, _jsonValue))
                        : createConfigStructure(label, jsonValue);

                    window.showInformationMessage(`success to create ${label} structure`);
                } catch (err) {
                    window.showErrorMessage('failed to create structure');
                }
            },
        })
    );

    baseQuickPick({ optionItems: configExistPickOptions });
}

/**
 * @helper
 */

interface CreateStructureParams extends ConfigExistQuickPickParams {
    label: string;
    jsonValue: types.JsonValue;
}
const createStructure = ({
    resourceControl,
    workspaceFolder,
    commandHandlerArgs,

    label,
    jsonValue,
}: CreateStructureParams) => {
    const { isResourceExist, createFolder, copyResource, getResourcePath } = resourceControl;

    const { source, destination, placeholder } = jsonValue;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const sourcePath = getResourcePath([configFolderPath, source]);
    const destinationPath = commandHandlerArgs
        ? getResourcePath([commandHandlerArgs.path, utils.flatStartRelativePath(destination)])
        : getResourcePath([configFolderPath, destination]);

    // execption 1. json에 source가 제대로 정의되어있지 않을 경우
    if (!isResourceExist(sourcePath)) {
        throw window.showErrorMessage(`no source exist for ${label}`);
    }

    // exception 2. json에 destination의 폴더 경로가 제대로 생성되어 있지 않을 경우
    if (!isResourceExist(destinationPath)) {
        createFolder(destinationPath);
    }

    const commonParams = {
        source: sourcePath,
        destination: destinationPath,
    };

    if (placeholder) {
        hanldePlaceholder(commonParams);
    } else {
        copyResource(commonParams);
    }
};

/**
 * @helpers
 */

function hanldePlaceholder(commonParams: Omit<CopryResourceParams, 'opts' | 'callback'>) {
    const input = window.createInputBox();
    input.placeholder = 'input the name of snippet';
    input.validationMessage = 'please input valid text';
    input.onDidAccept(() => {
        const inputValue = input.value;
        console.log(inputValue);
        input.hide();
    });
    input.onDidHide(() => input.dispose());
    input.show();
    // 1. config의 내용에 placeholder가 존재할 경우, 일단 input을 켜서 placeholder 값을 받는다
    // 2. 그 후 source에 대해서 재귀적으로 탐색하여서
    // 3. 내부에 ~.확장자이름.txt로 되어있는 파일을 찾으면
    // 4. 그 안에 있는 텍스트 내용 중, $placeholder라고 되어있는 텍스트를 찾아서 input값으로 변경시킨 후
}
