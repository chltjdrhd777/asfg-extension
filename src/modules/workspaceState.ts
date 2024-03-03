import * as vscode from 'vscode';

export class WorkspaceState<WorkspaceState> {
    constructor(private context: vscode.ExtensionContext, private stateKey: string) {}

    getWorkspaceState = () => {
        return this.context.workspaceState.get(this.stateKey) as WorkspaceState;
    };
    setWorkspaceState = (newState: WorkspaceState) => {
        this.context.workspaceState.update(this.stateKey, newState);
    };
}
