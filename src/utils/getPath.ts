import * as path from 'path';

export const getPath = (paths: string | string[]) => {
    if (typeof paths === 'string') {
        paths = [paths];
    }

    return path.join(...paths);
};
