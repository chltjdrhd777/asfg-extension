import * as vscode from 'vscode';
import { ResourceControl } from '../modules';
import { MessageControl } from '../modules/messageControl';

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
    messageControl: MessageControl;
    commandHandlerArgs?: CommandHandlerArgs;
}

/**
 * @Config
 */
export interface ASFGJsonValue {
    source: string;
    destination: string;
}
export interface SnippetJsonValue {
    body: string;
}

export interface ConfigData<Value> {
    [key: string]: Value;
}
