import * as vscode from 'vscode';
import { QuickPickOption } from '../types';

interface QuickPickParams {
    context: vscode.ExtensionContext;
    optionItems: QuickPickOption[];
}

export function baseQuickPick({ context, optionItems }: QuickPickParams) {
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = optionItems;
    quickPick.onDidChangeSelection(selections => {
        const selectedOption = selections[0] as QuickPickOption;

        if (selectedOption) {
            selectedOption.value({ context, quickPick });
        }
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
}
