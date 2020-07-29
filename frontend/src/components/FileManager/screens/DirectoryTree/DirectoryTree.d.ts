export interface DirectoryTreePropsModel {
    currentPath: string;
    // showLoadingCircular: (boolean)=>any;
    joinDirectory: (arg1: { path: string }) => any;
    currentRootDirectory: string;
}

export interface DirectoryTreeStateModel {}

export interface DirectoryTreeNode {
    [key: string]: Array<FileType>;
}
