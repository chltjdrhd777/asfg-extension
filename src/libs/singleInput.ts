import * as vscode from 'vscode';
import { BaseInputParams } from './types';

export async function singleInput({ context }: BaseInputParams) {
    const result = await vscode.window.showInputBox({
        title: 'Auto Structured Folder Generator',
        placeHolder: 'please enter your action defined in the "asfg.config.json"',
    });

    //처리 로직 import해서 한다.
    vscode.window.showInformationMessage(`Got: ${result}`);
}
