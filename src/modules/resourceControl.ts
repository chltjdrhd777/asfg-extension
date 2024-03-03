import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ResourceControl {
    private vscodeFS = vscode.workspace.fs;
    constructor(private workspaceFolder: vscode.WorkspaceFolder) {}

    isExistResource = (targetPath: string) => {
        const resourcePath = path.join(this.workspaceFolder.uri.path, targetPath);
        return fs.existsSync(resourcePath);
    };

    createUri = (path: string) => {
        return vscode.Uri.file(path);
    };

    createUnit8Array = (data: any) => {
        return new Uint8Array(data);
    };

    createFolder = (uri: vscode.Uri) => {
        this.vscodeFS.createDirectory(uri);
    };

    createFile = (uri: vscode.Uri, content: Uint8Array) => {
        this.vscodeFS.writeFile(uri, content);
    };
}
