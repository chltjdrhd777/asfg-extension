import * as vscode from 'vscode';
import { ResourceControl } from '../modules';

export interface CommonParams {
    context: vscode.ExtensionContext;
    workspaceFolder: vscode.WorkspaceFolder;
    resourceControl: ResourceControl;
}
