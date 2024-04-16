import { TextEditor, window } from 'vscode';
import { BaseParams } from '../../types';

interface CreateSnippetInputParams extends BaseParams {
    editor: TextEditor;
}
export async function createSnippetInput(createSnippetInputParams: CreateSnippetInputParams) {
    const {
        editor,
        workspaceFolder,
        resourceControl: { getResourcePath, createFolder, createFile, isResourceExist },
    } = createSnippetInputParams;

    const workSpacePath = workspaceFolder.uri.path;
    const snippetFolderPath = getResourcePath([workSpacePath, 'asfg.config', '_snippets']);

    const input = window.createInputBox();
    input.placeholder = 'input the name of snippet';
    input.onDidAccept(() => {
        const inputValue = input.value;

        //1. check _snippets folder existence
        const isSnippetFolderExist = isResourceExist(snippetFolderPath);
        if (!isSnippetFolderExist) {
            createFolder(snippetFolderPath);
        }

        //2. check snippet json file existence
        const snippetJsonPath = getResourcePath([snippetFolderPath, `${inputValue}.json`]);
        const isSnippetJsonExist = isResourceExist(snippetJsonPath);
        if (isSnippetJsonExist) {
            return window.showErrorMessage('😭 Already exist snippet. Please try another name');
        }

        //3. create snippet json file
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        createFile(
            snippetJsonPath,
            JSON.stringify({
                name: inputValue,
                body: selectedText,
            })
        );

        window.showInformationMessage('🎉 your snippet is registered');
        input.hide();
    });
    input.onDidHide(() => input.dispose());
    input.show();

    //4. 만약 없다면, 입력된 이름으로 된 json 파일 생성 후, {name:입력이름, body:복사된 내용} 의 형태로 생성시킨다.
}

/**
 * @helpers
 */

function check() {}
