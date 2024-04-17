import { BaseParams } from '../../types';
import * as utils from '../../utils';
import * as types from '../../types';
import { baseQuickPick } from '../asfg/baseQuickPick';
import { window } from 'vscode';

interface ApplySnippetQuickPickParams extends BaseParams {}

export async function applySnippetQuickPick(applySnippetQuickPickParams: ApplySnippetQuickPickParams) {
    const {
        workspaceFolder,
        resourceControl: { getResourcePath },
        messageControl: { showMessage },
    } = applySnippetQuickPickParams;

    const workSpacePath = workspaceFolder.uri.path;
    const configFolderPath = getResourcePath([workSpacePath, 'asfg.config']);
    const snippetsJsonPath = getResourcePath([configFolderPath, 'snippets.json']);

    const snippetsJsonData = utils.readConfigJson<types.SnippetJsonValue>(snippetsJsonPath);

    const snipetOptions = Object.entries(snippetsJsonData).map(([label, jsonValue]) => ({
        label,
        value: () => {
            try {
                const { body } = jsonValue;

                if (!body) {
                    return showMessage({
                        type: 'error',
                        message: '😭 Not valid body in snippet, please check the json ',
                    });
                }

                pasteSnippetToPosition(body);
            } catch (err) {
                showMessage({ type: 'error', message: '😭' });
            }
        },
    }));

    baseQuickPick({ optionItems: snipetOptions });
}

/**
 * @helpers
 */

function pasteSnippetToPosition(body: string) {
    const editor = window.activeTextEditor;

    if (editor) {
        const { selection } = editor;
        const startPosition = selection.start;
        const endPosition = selection.end;
        const position = startPosition.isEqual(endPosition) ? startPosition : endPosition;

        editor.edit(builder => {
            builder.insert(position, body);
        });
    }
}
