import { TextEditor, window } from 'vscode';
import { BaseParams } from '../../types';
import { exec } from 'child_process';

interface CreateSnippetInputParams extends BaseParams {
    editor: TextEditor;
}
export async function createSnippetInput(createSnippetInputParams: CreateSnippetInputParams) {
    const {
        editor,
        workspaceFolder,
        resourceControl: { getResourcePath, createFile, isResourceExist, readResource, writeResource },
        messageControl: { showMessage, showTimedMessage },
    } = createSnippetInputParams;

    const workSpacePath = workspaceFolder.uri.path;
    const snippetsJsonPath = getResourcePath([workSpacePath, 'asfg.config', 'snippets.json']);

    const input = window.createInputBox();
    input.placeholder = 'input the name of snippet';
    input.onDidAccept(() => {
        const inputValue = input.value;

        //1. check snippets.json existence
        const isSnippetsJsonExist = isResourceExist(snippetsJsonPath);
        if (!isSnippetsJsonExist) {
            createFile(snippetsJsonPath, '{}');
        }

        //2. read snippets json and check whether the snippet name is registered
        const resourceContent = readResource(snippetsJsonPath) as string;
        const prevContent = JSON.parse(resourceContent ?? {});
        const isExistSnippetName = Object.keys(prevContent).find(snippetName => snippetName === inputValue);
        if (isExistSnippetName) {
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
