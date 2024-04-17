import { baseQuickPick } from './baseQuickPick';
import { BaseParams } from '../../types';

import * as utils from '../../utils';
import { ASFGJsonValue } from '../../types';

interface ConfigExistPickOption {
    label: string;
    value: () => void;
}

interface ConfigExistQuickPickParams extends BaseParams {}

export async function configExistQuickPick(configExistQuickPickParams: ConfigExistQuickPickParams) {
    const {
        workspaceFolder,
        resourceControl: { getResourcePath, isResourceExist },
        messageControl: { showMessage, showTimedMessage },
    } = configExistQuickPickParams;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const configJsonPath = getResourcePath([configFolderPath, 'config.json']);

    // 만약 config.json이 없을 경우
    if (!isResourceExist(configJsonPath)) {
        return showMessage({ type: 'error', message: '😭 No config.json was detected' });
    }

    const configJsonData = utils.readConfigJson<ASFGJsonValue | ASFGJsonValue[]>(configJsonPath);
    const configExistPickOptions: ConfigExistPickOption[] = Object.entries(configJsonData).map(
        ([label, jsonValue]) => ({
            label,
            value: () => {
                try {
                    // 1. 만약 config value가 다중 생성(여러 폴더에 구조 생성)일 경우(배열)
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
                        //2. 그 외 = config value는 단일 생성으로 되어있을 경우(x 배열)
                        generateConfigBasedStructure({
                            label,
                            jsonValue,
                            ...configExistQuickPickParams,
                        });
                    }

                    showTimedMessage({ message: `🎉 success to create ${label} structure` });
                } catch (err) {
                    showMessage({ type: 'error', message: '😭 failed to create structure' });
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
    jsonValue: ASFGJsonValue;
}
const generateConfigBasedStructure = (generateConfigBasedStructureParams: GenerateConfigBasedStructureParams) => {
    const {
        resourceControl: { isResourceExist, createFolder, copyResource, getResourcePath },
        messageControl: { showMessage, showTimedMessage },
        workspaceFolder,
        commandHandlerArgs,

        label,
        jsonValue,
    } = generateConfigBasedStructureParams;
    const { source, destination } = jsonValue;

    // exception 0. json의 형태가 잘못되어 있을 경우
    if (!source || !destination) {
        return showMessage({ type: 'error', message: `😭 Not valid config.json foramt. please follow the tutorial` });
    }

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const sourcePath = getResourcePath([configFolderPath, source]);

    // 만약 commandHandlerArgs가 존재한다는건 => 우클릭을 통해서 command를 실행했다는 것 => 우클릭 폴더가 생성 기점이 되어야 한다.
    const destinationPath = commandHandlerArgs
        ? getResourcePath([commandHandlerArgs.path, utils.flatStartRelativePath(destination)])
        : getResourcePath([configFolderPath, destination]);

    // execption 1. json에 source가 제대로 정의되어있지 않을 경우
    if (!isResourceExist(sourcePath)) {
        return showMessage({ type: 'error', message: `😭 no source exist for ${label}` });
    }

    // exception 2. json에 destination의 폴더 경로가 제대로 생성되어 있지 않을 경우
    if (!isResourceExist(destinationPath)) {
        createFolder(destinationPath);
    }

    // 지정된 structure을 안에 정의
    copyResource({
        source: sourcePath,
        destination: destinationPath,
    });
};
