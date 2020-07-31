export interface SearchPropsModel {
    currentPath: string;
    setSearchText: (arg1: string) => any;
}
export interface SearchStateModel {
    hiddenSearch: boolean;
    autoSearch: boolean;
    searchFieldText: string;
}
