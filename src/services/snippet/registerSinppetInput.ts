import { TextEditor, window } from 'vscode';
import { BaseParams } from '../../types';
import { exec } from 'child_process';
import { createASFGConfigFolder } from '../asfg';

interface RegisterSinppetInputParams extends BaseParams {
    editor: TextEditor;
}
export async function registerSnippetInput(registerSinppetInputParams: RegisterSinppetInputParams) {
    const {
        editor,
        workspaceFolder,
        resourceControl: { getResourcePath, createFile, createFolder, isResourceExist, readFile, writeResource },
        messageControl: { showMessage, showTimedMessage },
    } = registerSinppetInputParams;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const snippetsJsonPath = getResourcePath([configFolderPath, 'snippets.json']);

    const input = window.createInputBox();
    input.placeholder = 'input the name of snippet';
    input.onDidAccept(() => {
        const inputValue = input.value;

        //0. check config folder
        if (!isResourceExist(configFolderPath)) {
            createASFGConfigFolder({ ...registerSinppetInputParams, logging: false });
            createFile(snippetsJsonPath, '{}');
        }

        //1. check snippets.json existence
        if (!isResourceExist(snippetsJsonPath)) {
            createFile(snippetsJsonPath, '{}');
        }

        //2. read snippets json and check whether the snippet name is registered
        const resource = readFile(snippetsJsonPath) as string;
        const prevContent = JSON.parse(resource ?? {});
        const isAlreadyExistSnippetName = Object.keys(prevContent).find(snippetName => snippetName === inputValue);
        if (isAlreadyExistSnippetName) {
            return showMessage({ type: 'error', message: '😭 Already exist snippet. Please try another name' });
        }

        //3. create snippet
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const newContent = { ...prevContent, [inputValue]: { body: selectedText } };

        writeResource(snippetsJsonPath, JSON.stringify(newContent));
        exec(`npx prettier --write ${snippetsJsonPath}`);
        showTimedMessage({ message: '🎉 your snippet is registered' });
        input.hide();
    });
    input.onDidHide(() => input.dispose());
    input.show();
}
