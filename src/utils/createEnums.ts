export const createEnums = <KeyList extends string[]>(keyList: KeyList) => {
    const map = {} as { [K in KeyList[number]]: string };

    keyList.forEach(key => {
        map[key as KeyList[number]] = Symbol(key).toString();
    });

    return Object.freeze(map) as { readonly [K in KeyList[number]]: string };
};
