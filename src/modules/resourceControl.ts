import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { mkdirp } from 'mkdirp';
import * as utils from '../utils';

interface CopryResourceParams {
    source: string | URL;
    destination: string | URL;
    opts?: fs.CopyOptions;
    callback?: (err: NodeJS.ErrnoException | null) => void;
}

export class ResourceControl {
    private vscodeFS = vscode.workspace.fs;
    constructor(private workspaceFolder: vscode.WorkspaceFolder) {}

    isResourceExistFromRoot = (targetPath: string) => {
        const resourcePath = path.join(this.workspaceFolder.uri.path, targetPath);
        console.log('resource path is', resourcePath, fs.existsSync(resourcePath));
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
        } else {
            console.log(`Already exist target file : ${uri}`);
        }
    };

    copyResource = ({
        source,
        destination,
        opts = { recursive: true },
        callback = err => {
            console.log('fail to copy resource', err);
        },
    }: CopryResourceParams) => {
        fs.cp(source, destination, opts, callback);
    };

    insertContent = (
        filePath: string,
        scriptToInsert: string,
        config?: { insertPosition: 'bottom' | number }
    ) => {
        try {
            let data = fs.readFileSync(filePath, 'utf-8');
            data += `\n${scriptToInsert}`;
            fs.writeFileSync(filePath, data);
        } catch (err) {
            console.error('faile to insert file content');
        }
    };
}
