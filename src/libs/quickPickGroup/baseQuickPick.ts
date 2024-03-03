import * as vscode from 'vscode';
import { BaseQuickPickOption } from './types';

interface QuickPickParams<OptionItems> {
    optionItems: OptionItems;
}

export function baseQuickPick<OptionItems extends BaseQuickPickOption<any>[]>({
    optionItems,
}: QuickPickParams<OptionItems>) {
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = optionItems;
    quickPick.onDidChangeSelection(selections => {
        const selectedOption = selections[0] as OptionItems[number];

        selectedOption?.value();
        quickPick.hide();
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
}
