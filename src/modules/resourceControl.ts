import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { mkdirp } from 'mkdirp';
import * as utils from '../utils';

// import {utils} from ''

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

    getResourcePath = (paths: string | string[]) => {
        return utils.getResourcePath(paths);
    };

    createFolder = (uri: string) => {
        // this.vscodeFS.createDirectory(uri);
        mkdirp.sync(uri);
    };

    createFile = (uri: string, content: string) => {
        // this.vscodeFS.writeFile(uri, content);
        if (!fs.existsSync(uri)) {
            fs.writeFileSync(uri, content);
        }
    };
}
