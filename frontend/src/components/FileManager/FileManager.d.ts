export interface FileModel {
    name: string;
    type: string;
    path: string;
    typeGroup: string;
}

export class Path {
    constructor(newPath: string) {
        if (newPath !== '/' && newPath[-1] === '/') newPath.slice(0, -1);
        this.path = newPath;
    }
    private path = '';
    public getPath = () => {
        return this.path;
    };
    public getRootDirectory = () => {
        if (this.path[0] === '/') return '/';
        return this.path.split('/')[0];
    };
}

export interface FileManagerStateModel {
    files: Array<FileModel>;
    selectedFiles: Map<string, FileModel>;
    currentPath: string;
    managerError: any;
    visibleFilesExtensions: Array<string>;
    acceptableFilesExtensions: Set<string> | undefined;
    sortMethodNumber: number;
    areSettingsOpen: boolean;
    searchText: string;
    //filesDisplaySize: number;
}

export interface FileManagerPropsModel {
    minNumberOfSelectedFiles?: number;
    maxNumberOfSelectedFiles?: number;
    selectFiles?: ((arg1: Array<string>) => any) | ((arg1: Array<FileModel>) => any);
    directoryOnStart?: string;
    closeFileManager?: () => any;
    visibleFilesExtensions?: Array<string>;
    acceptableFilesExtensions?: Array<string>;
    open?: boolean;
    withFilesStats?: boolean;
    //config?: FileManagerConfigTypes;
}

/*
export interface SelectionProps {
    selectedFilesState: Set<string>;
    startPosition: {
        x: number;
        y: number;
        isRightMB: boolean;
    };
    filesRefs: any;
    setSelectedFiles: Function;
    endSelection: Function;
    maxNumberOfSelectedFiles: number;
}*/
