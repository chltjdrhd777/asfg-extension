import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class ResourceControl {
    private paths = {
        workspacePath: vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath ?? '',
    };

    getPaths = () => this.paths;

    isResourceExist = (resourcePath: string = '') => {
        return fs.existsSync(path.join(this.paths.workspacePath, resourcePath));
    };
}
