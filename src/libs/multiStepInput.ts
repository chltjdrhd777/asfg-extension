import * as vscode from 'vscode';
import { MultiStepInputParams } from './types';

export async function multiStepInput({ context, inputPoxOptions = {} }: MultiStepInputParams) {
    const state = {};

    try {
        const initInput = vscode.window.createInputBox();
        const input = { ...initInput, ...inputPoxOptions };

        // vscode.window.showInformationMessage(`Got: ${result}`);
    } catch (err) {}
}

//helper
type InputStep = (input: MultiStepInput) => Thenable<InputStepResult>;
type InputStepResult = InputStep | void;

class MultiStepInput {
    private current?: vscode.QuickInput;
    private steps: InputStep[] = [];

    static async run(start: InputStep) {
        const input = new MultiStepInput();
        return input.stepThrouph(start);
    }

    private async stepThrouph(start: InputStep) {
        let step: InputStepResult = start;
    }
}
