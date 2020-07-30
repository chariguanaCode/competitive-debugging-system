export interface SelectedListPropsModel {
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    selectedFiles: Set<string>;
}

export interface SelectedListStateModel {}
