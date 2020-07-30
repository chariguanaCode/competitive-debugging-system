export interface NavigationPropsModel {
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    currentPath: string;
    setRootDirectory: (newRootDirectory: string) => any;
}

export interface NavigationStateModel {
    newPath: string | null;
    isEditMode: boolean;
    historyList: Array<string>;
}
