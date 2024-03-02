import * as vscode from 'vscode';
import { CommonParams, QuickPickOption } from '../types';

interface NoConfigCaseQuickPickParams extends CommonParams {}

export async function noConfigCaseQuickPick({
    context,
    resourceControl,
}: NoConfigCaseQuickPickParams) {
    const options: QuickPickOption[] = [
        { label: 'make example structure on the workspace', value: () => {} },
        { label: 'make example config', value: () => {} },
    ];

    await vscode.window.showQuickPick(options, {
        onDidSelectItem: item => {
            console.log('item is', item);
        },
    });
}
