import * as path from 'path';

export const getResourcePath = (paths: string | string[]) => {
    if (typeof paths === 'string') {
        paths = [paths];
    }

    return path.join(...paths);
};
