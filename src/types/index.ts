import * as vscode from 'vscode';
import { ResourceControl } from '../modules';

export interface CommonParams {
    context: vscode.ExtensionContext;
    workspaceFolder: vscode.WorkspaceFolder;
    resourceControl: ResourceControl;
}

/**
 * @Config
 */
export interface JsonValue {
    source: string;
    destination: string;
}

export interface ConfigJsonData {
    [key: string]: JsonValue | JsonValue[];
}
