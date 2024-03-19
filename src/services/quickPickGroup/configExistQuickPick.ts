import * as vscode from 'vscode';

import { baseQuickPick } from './baseQuickPick';
import { CommonParams } from '../../types';

import * as utils from '../../utils';
import * as types from '../../types';

interface ConfigExistPickOption {
    label: string;
    value: () => void;
}

interface ConfigExistQuickPickParams extends CommonParams {}

export async function configExistQuickPick(configExistQuickPickParams: ConfigExistQuickPickParams) {
    const { workspaceFolder, resourceControl } = configExistQuickPickParams;
    const { getResourcePath } = resourceControl;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const configJsonPath = getResourcePath([configFolderPath, 'config.json']);

    const configJsonData = utils.readConfigJson(configJsonPath);
    const configExistPickOptions: ConfigExistPickOption[] = Object.entries(configJsonData).map(
        ([label, jsonValue]) => ({
            label,
            value: () => {
                if (Array.isArray(jsonValue)) {
                    const jsonValues = jsonValue;

                    jsonValues.map(_jsonValue =>
                        generateConfigBasedStructure({
                            label,
                            jsonValue: _jsonValue,
                            ...configExistQuickPickParams,
                        })
                    );
                } else {
                    generateConfigBasedStructure({
                        label,
                        jsonValue,
                        ...configExistQuickPickParams,
                    });
                }
            },
        })
    );

    baseQuickPick({ optionItems: configExistPickOptions });
}

/**
 * @helper
 */

interface GenerateConfigBasedStructureParams extends ConfigExistQuickPickParams {
    label: string;
    jsonValue: types.JsonValue;
}
const generateConfigBasedStructure = ({
    resourceControl,
    workspaceFolder,

    label,
    jsonValue,
}: GenerateConfigBasedStructureParams) => {
    const { isResourceExist, createFolder, copyResource, getResourcePath } = resourceControl;

    const { source, destination } = jsonValue;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);

    const sourcePath = getResourcePath([configFolderPath, source]);
    const destinationPath = getResourcePath([configFolderPath, destination]);

    // execption 1. json에 source가 제대로 정의되어있지 않을 경우
    if (!isResourceExist(sourcePath)) {
        throw vscode.window.showErrorMessage(`no source exist for ${label}`);
    }

    // exception 2. json에 destination의 폴더 경로가 제대로 생성되어 있지 않을 경우
    if (!isResourceExist(destinationPath)) {
        createFolder(destinationPath);
    }

    // 지정된 structure을 안에 정의
    copyResource({
        source: sourcePath,
        destination: destinationPath ?? workSpacePath,
    });
};
