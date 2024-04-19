import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { mkdirp } from 'mkdirp';
import * as utils from '../utils';
import { MessageControl } from './messageControl';

interface CopryResourceParams {
    source: string;
    destination: string;
    opts?: fs.CopyOptions;
    callback?: (err: NodeJS.ErrnoException | null) => void;
}

export class ResourceControl {
    private vscodeFS = vscode.workspace.fs;
    constructor(private workspaceFolder: vscode.WorkspaceFolder, private messageControl: MessageControl) {}

    isResourceExist = (targetPath: string | string[]) => {
        if (!Array.isArray(targetPath)) {
            targetPath = [targetPath];
        }

        return fs.existsSync(path.join(...targetPath));
    };

    isResourceExistFromRoot = (targetPath: string) => {
        const resourcePath = path.join(this.workspaceFolder.uri.path, targetPath);
        return fs.existsSync(resourcePath);
    };

    createUri = (path: string) => {
        return vscode.Uri.file(path);
    };

    createUnit8Array = (data: any) => {
        return new Uint8Array(data);
    };

    getPath = (paths: string | string[]) => {
        return utils.getPath(paths);
    };

    readFolder = (path: string) => {
        return fs.readdirSync(path);
    };

    readFile = (path: string) => {
        return fs.readFileSync(path, 'utf8');
    };

    writeResource = (path: string, content: string) => {
        try {
            fs.writeFileSync(path, content);
        } catch (err) {
            console.log('fail to write resource');
        }
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
            if (err) {
                console.log('error is', err);

                this.messageControl.showMessage({
                    type: 'error',
                    message: '😭 unexpected failure for copying the resource',
                });
            }
        },
    }: CopryResourceParams) => {
        if (destination && !this.isResourceExist(destination)) {
            this.createFolder(destination);
        }

        fs.cp(source, destination, opts, callback);
    };

    insertContent = (filePath: string, scriptToInsert: string, config?: { insertPosition: 'bottom' | number }) => {
        try {
            let data = fs.readFileSync(filePath, 'utf-8');
            data += `${scriptToInsert}`;
            fs.writeFileSync(filePath, data);
        } catch (err) {
            console.error('faile to insert file content');
        }
    };
}
