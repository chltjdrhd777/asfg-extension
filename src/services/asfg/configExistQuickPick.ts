import { baseQuickPick } from './baseQuickPick';
import { BaseParams } from '../../types';

import * as utils from '../../utils';
import { ASFGJsonValue } from '../../types';
import { window } from 'vscode';
import fs from 'fs';

interface ConfigExistPickOption {
    label: string;
    value: () => void;
}

interface ConfigExistQuickPickParams extends BaseParams {}

export async function configExistQuickPick(configExistQuickPickParams: ConfigExistQuickPickParams) {
    const {
        workspaceFolder,
        resourceControl: { getPath, isResourceExist },
        messageControl: { showMessage, showTimedMessage },
    } = configExistQuickPickParams;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getPath([workSpacePath, 'asfg.config']);
    const configJsonPath = getPath([configFolderPath, 'config.json']);

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

                    // showTimedMessage({ message: `🎉 success to create ${label} structure` });
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
        resourceControl: { isResourceExist, createFolder, copyResource, getPath },
        messageControl: { showMessage },
        workspaceFolder,
        commandHandlerArgs,

        label,
        jsonValue,
    } = generateConfigBasedStructureParams;
    const { source, destination, placeholder } = jsonValue;

    // exception 0. json의 형태가 잘못되어 있을 경우
    if (!source || !destination) {
        return showMessage({ type: 'error', message: `😭 Not valid config.json foramt. please follow the tutorial` });
    }

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getPath([workSpacePath, 'asfg.config']);
    const sourcePath = getPath([configFolderPath, source]);

    // 만약 commandHandlerArgs가 존재한다는건 => 우클릭을 통해서 command를 실행했다는 것 => 우클릭 폴더가 생성 기점이 되어야 한다.
    const destinationPath = commandHandlerArgs
        ? getPath([commandHandlerArgs.path, utils.flatStartRelativePath(destination)])
        : getPath([configFolderPath, destination]);

    // execption 1. json에 source가 제대로 정의되어있지 않을 경우
    if (!isResourceExist(sourcePath)) {
        return showMessage({ type: 'error', message: `😭 no source exist for ${label}` });
    }

    // 지정된 structure을 안에 정의
    if (placeholder) {
        handlePlaceholder({ ...generateConfigBasedStructureParams, placeholder, sourcePath, destinationPath });
    } else {
        copyResource({
            source: sourcePath,
            destination: destinationPath,
        });
    }
};

/**
 * @helpers
 */

interface HandlePlaceholderParams extends GenerateConfigBasedStructureParams {
    sourcePath: string;
    destinationPath: string;
    placeholder: string[];
}
async function handlePlaceholder(handlePlaceholderParams: HandlePlaceholderParams) {
    const {
        placeholder,
        messageControl: { showMessage },
    } = handlePlaceholderParams;

    if (!Array.isArray(placeholder)) {
        return showMessage({
            type: 'error',
            message: '😭 placeholder is not valid. please set the string array instead',
        });
    }

    //1. 사용자의 입력을 받아온다
    const inputMap = await showInputBoxes(placeholder);
    changePlaceholderRecursively({ ...handlePlaceholderParams, inputMap });
}

async function showInputBoxes(placeholder: string[]) {
    const inputMap = new Map<string, string>();
    for (let idx = 0; idx < placeholder.length; idx++) {
        const eachPlaceholder = placeholder[idx];
        const input = window.createInputBox();
        input.title = 'Please set your placeholder value';
        input.step = idx + 1;
        input.totalSteps = placeholder.length;
        input.placeholder = eachPlaceholder;

        // input 보이기
        input.show();

        // 사용자가 입력을 완료하면 실행되는 함수
        await new Promise(resolve => {
            input.onDidAccept(() => {
                const value = input.value;
                if (!value) {
                    window.showErrorMessage('😭 Please input a valid value');
                    return;
                }

                inputMap.set(eachPlaceholder, value);
                input.hide();
                resolve(true);
            });
        });

        // 사용자가 input을 숨길 때 input을 삭제
        input.onDidHide(() => input.dispose());
    }

    return inputMap;
}

interface ChangePlaceholderRecursivelyParams extends HandlePlaceholderParams {
    inputMap: Map<string, string>;
}
async function changePlaceholderRecursively(changePlaceholderRecursivelyParams: ChangePlaceholderRecursivelyParams) {
    const {
        resourceControl: { createFolder, readFolder, readFile, createFile, getPath },
        messageControl: { showMessage },
        inputMap,
        sourcePath,
        destinationPath,
    } = changePlaceholderRecursivelyParams;

    const resourceNames = readFolder(sourcePath);

    const replacePlaceholderToValue = (data: string) => {
        inputMap.forEach((value, key) => {
            const regex = new RegExp(`\\${key}`, 'gi');
            data = data.replace(regex, value);
        });

        return data;
    };

    const recursive = async ({
        sourcePath,
        folderPath = '',
        resourceNames,
    }: {
        sourcePath: string;
        folderPath?: string;
        resourceNames: string[];
    }) => {
        resourceNames.forEach(async resourceName => {
            const resourcePath = getPath([sourcePath, resourceName]);
            const stats = await fs.promises.stat(resourcePath);

            if (stats.isDirectory()) {
                // 폴더일 경우, destination경로로 폴더를 만들어주고 재귀적으로 내부에서 재처리한다.
                const replacedFolderName = replacePlaceholderToValue(resourceName);
                const destinationFolderPath = getPath([folderPath, replacedFolderName]);

                createFolder(getPath([destinationPath, destinationFolderPath]));

                await recursive({
                    sourcePath: resourcePath,
                    folderPath: destinationFolderPath,
                    resourceNames: readFolder(resourcePath),
                });
            } else {
                // 파일일 경우, 파일 이름을 확인해서 해당되면 내부 내용의 placeholder을 변경 후 write한다.
                const targetFileNameRegex = /^.+\.([^\.]+)\.txt$/;

                if (targetFileNameRegex.test(resourceName)) {
                    let data = readFile(resourcePath);
                    const replacedData = replacePlaceholderToValue(data);

                    const newFileName = resourceName.replace('.txt', '');
                    const newFilePath = getPath([destinationPath, folderPath, newFileName]);

                    createFile(newFilePath, replacedData);
                }
            }
        });
    };

    recursive({ sourcePath, resourceNames });
}
