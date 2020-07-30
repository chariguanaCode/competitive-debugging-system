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
    selectedFiles: Set<string>;
    currentPath: string;
    managerError: any;
    visibleFilesExtensions: Array<string>;
    acceptableFilesExtensions: Set<string> | undefined;
    sortMethodNumber: number;
    areSettingsOpen: boolean;
    //filesDisplaySize: number;
}

export interface FileManagerPropsModel {
    minNumberOfSelectedFiles?: number;
    maxNumberOfSelectedFiles?: number;
    selectFiles: (arg1: Array<string>) => any;
    directoryOnStart: string;
    closeFileManager: () => any;
    visibleFilesExtensions?: Array<string>;
    acceptableFilesExtensions?: Array<string>;
    open?: boolean;
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
}

export interface SettingsProps {
    open: boolean;
    dialogClose: Function;
    loadedSettings?: any;
}

export interface SettingsState {
    homeDirectory: string;
    renderFilesBlockSize: number;
}

export interface ToolbarProps {
    changeSortMethodNumber: Function;
    changeFilesDisplaySize: Function;
    filesDisplaySize: number;
    sortMethodNumber: number;
    setHiddenSearch: Function;
}

export interface SelectedFilesProps {
    selectedFiles: Set<string>;
    loadDirectory: Function;
}

export interface ContextTypes {
    showFileManager: (v: FileManagerProps) => void;
}
*/
