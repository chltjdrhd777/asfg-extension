'use client';

import * as React from 'react';

export function createContext<ContextValue extends object | null>() {
    const Context = React.createContext<ContextValue | null>(null);

    const Provider = ({ value, children }: React.PropsWithChildren<{ value: ContextValue }>) => {
        const dependencies: React.DependencyList = value ? Object.values(value) : [];
        const memorizedValue = React.useMemo(() => value, dependencies);
        return <Context.Provider value={memorizedValue}>{children}</Context.Provider>;
    };

    const useContext = (consumerName?: string) => {
        const contextValue = React.useContext(Context);
        if (contextValue) {
            return contextValue;
        }

        throw new Error(`useContext는 ${consumerName ?? 'react component'} 안에서 사용해야 합니다.`);
    };

    return {
        Context,
        useContext,
        Provider,
    };
}
