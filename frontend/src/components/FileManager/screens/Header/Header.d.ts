export interface HeaderPropsModel {
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    currentPath: string;
    setRootDirectory: (newRootDirectory: string) => any;
    sortMethodNumber: number;
    setSortMethodNumber: (number) => any;
    dialogClose: () => any;
}

export interface HeaderStateModel {
    historyList: Array<string>;
    searchFieldAutoSearch: boolean;
    searchFieldText: string;
}
