export interface SearchPropsModel {
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    currentPath: string;
}
export interface SearchStateModel {
    hiddenSearch: boolean;
    autoSearch: boolean;
    searchFieldText: string;
}
