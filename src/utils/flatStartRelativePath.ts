export const flatStartRelativePath = (path: string) => {
    if (path.startsWith('../')) {
        return path.replace(/^(\.\.\/)/, './');
    }

    return path;
};
