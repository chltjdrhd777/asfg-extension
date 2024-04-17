import * as fs from 'fs';
import * as vscode from 'vscode';
import * as types from '../types';

export const readConfigJson = <Value>(configFilePath: string) => {
    try {
        const data: Buffer = fs.readFileSync(configFilePath);
        const configData: types.ConfigData<Value> = JSON.parse(data.toString());
        return configData;
    } catch (err) {
        throw vscode.window.showErrorMessage('no valid config data detected, try again');
    }
};
