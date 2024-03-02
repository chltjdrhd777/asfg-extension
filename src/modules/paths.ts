import * as vscode from 'vscode';

interface BasePaths {
    workSpacePath?: string;
    extensionPath?: string;
}

export class Paths<CustomPaths extends object> {
    private paths: BasePaths = {
        workSpacePath: '',
        extensionPath: '',
    };

    constructor(context: vscode.ExtensionContext, customPaths?: CustomPaths) {
        this.paths = {
            workSpacePath: vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath ?? '',
            extensionPath: context.extensionPath,
        };

        if (customPaths) {
            this.paths = { ...this.paths, ...customPaths };
        }
    }

    getPaths() {
        return this.paths as BasePaths & CustomPaths;
    }
}
