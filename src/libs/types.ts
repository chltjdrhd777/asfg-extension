import * as vscode from 'vscode';
import { ResourceControl } from '../modules/resourceControl';

export interface BaseInputParams {
    context: vscode.ExtensionContext;
}

export interface MultiStepInputParams extends BaseInputParams {
    inputPoxOptions?: Partial<vscode.InputBox>;
}

/**
 * common params
 */
export interface CommonParams {
    readonly context: vscode.ExtensionContext;
    readonly resourceControl: ResourceControl;
}

/**
 * QuickPick
 */
export type QuickPickOptionValue = (params: {
    context: vscode.ExtensionContext;
    quickPick: vscode.QuickPick<vscode.QuickPickItem>;
}) => Promise<void>;

export interface QuickPickOption {
    label: string;
    value: QuickPickOptionValue | Function;
}
