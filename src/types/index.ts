import * as vscode from 'vscode';
import { ResourceControl, WorkspaceState } from '../modules';

export interface CommonParams {
    context: vscode.ExtensionContext;
    commonWorkspaceState: WorkspaceState<{ workSpace: vscode.WorkspaceFolder }>;
    resourceControl: ResourceControl;
}
