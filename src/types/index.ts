import * as vscode from 'vscode';
import { ResourceControl } from '../modules';

/**
 * @CommonTypes
 */

export interface CommandHandlerArgs {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
    _formatted: string;
    _fsPath: string;
}

export interface BaseParams {
    context: vscode.ExtensionContext;
    workspaceFolder: vscode.WorkspaceFolder;
    resourceControl: ResourceControl;
    commandHandlerArgs?: CommandHandlerArgs;
}

/**
 * @Config
 */
export interface JsonValue {
    source: string;
    destination: string;
    placeholder?: boolean;
}

export interface ConfigJsonData {
    [key: string]: JsonValue | JsonValue[];
}
