export interface BaseQuickPickOption<P> {
    label: string;
    value: (params?: P) => void;
}
