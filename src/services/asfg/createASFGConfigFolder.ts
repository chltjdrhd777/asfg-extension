import { BaseParams } from '../../types';
import * as contants from '../../constants';

interface CreateASFGConfigFolderParams extends BaseParams {
    logging?: boolean;
}
export function createASFGConfigFolder(createASFGConfigFolderParams: CreateASFGConfigFolderParams) {
    const {
        workspaceFolder,
        resourceControl: { createFile, createFolder, isResourceExistFromRoot, getPath, readFile, insertContent },
        messageControl: { showMessage },
        logging = true,
    } = createASFGConfigFolderParams;
    const workSpacePath = workspaceFolder.uri.path;

    // 1. create asfg.config folder
    createFolder(getPath([workSpacePath, 'asfg.config']));

    // 2. apply this folder to gitignore
    const gitignoreFilePath = getPath([workSpacePath, '.gitignore']);

    if (!isResourceExistFromRoot('.gitignore')) {
        createFile(gitignoreFilePath, contants.exampleGitignoreContent);
    } else {
        const gitignore = readFile(gitignoreFilePath);

        if (!gitignore?.includes('asfg.config')) {
            insertContent(gitignoreFilePath, contants.exampleGitignoreContent);
        }
    }

    if (logging) {
        showMessage({ message: '🎉 the asfg.config folder is created successfully' });
    }
}
