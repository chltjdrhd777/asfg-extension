import * as vscode from 'vscode';

const collectionsGlobalKey = 'collections';

export class Collections<C extends object> {
    constructor(private context: vscode.ExtensionContext, private collectionGroup?: C) {}

    setCollectionGroupToGlobal() {
        this.context.globalState.update(collectionsGlobalKey, this.collectionGroup);
    }

    getCollectionGroupFromGlobal() {
        return this.context.globalState.get(collectionsGlobalKey) as C;
    }
}
