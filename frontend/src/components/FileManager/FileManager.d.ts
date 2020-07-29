export interface FileModel {
    name: string;
    type: string;
    path: string;
    typeGroup: string;
}

export interface FileManagerStateModel {
    files: Array<FileModel>;
    selectedFiles: Set<string>;
    currentPath: string;
    currentRootPath: string;
    managerError: any;
    visibleFilesExtensions: Array<string>;
    acceptableFilesExtensions: Set<string> | undefined;
    //mouseOverPath: string;
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

export interface RenderFilesProps {
    files: Array<FileType>;
    selectedFiles: Set<string>;
    onFileClick: Function;
    mouseOverPath: string;
    renderForce: number;
    showDeleteFileFromSelectedFilesButton: Function;
    //displaySettings: { numberOfColumns: number };
    startIndex?: number;
    renderFilesLimit: number;
    setFilesRefs: any;
    saveRefs?: boolean;
    onFileKeyDown: Function;
    filesDisplaySize: number;
    acceptableFileTypes: Set<string> | undefined;
}

export interface ContextTypes {
    showFileManager: (v: FileManagerProps) => void;
}
*/
