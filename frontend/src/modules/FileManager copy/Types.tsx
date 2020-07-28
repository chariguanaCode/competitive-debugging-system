import { FileManagerConfigTypes } from '../../utils/GlobalStateContext';

export interface FileType {
    name: string;
    type: string;
    path: string;
    typeGroup: string;
}

export interface FileManagerState {
    files: Array<FileType>;
    selectedFiles: Set<string>;
    currentPath: string;
    currentRootPath: string;
    managerError: any;
    filesTypes: Array<string>;
    acceptableFileTypes: Set<string> | undefined;
    mouseOverPath: string;
    sortMethodNumber: number;
    areSettingsOpen: boolean;
    filesDisplaySize: number;
}

export interface FileManagerProps {
    minNumberOfSelectedFiles?: number;
    maxNumberOfSelectedFiles?: number;
    selectFiles: (v: Array<string>) => any;
    loadDirectoryOnStart: string;
    dialogClose: Function;
    availableFilesTypes?: Array<string>;
    acceptableFileTypes?: Array<string>;
    isFileManagerOpen?: boolean;
    config?: FileManagerConfigTypes;
}

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

export interface MainToolbarState {
    newPath: any;
    historyList: Array<string>;
    //showFilesRenderForce: Array<0>,
    fieldMode: boolean;
}

export interface MainToolbarProps {
    loadDirectory: Function;
    currentPath: string;
    setRootDirectory: Function;
    currentRootDirectory: string;
}

export interface FoldersTreeProps {
    currentPath: string;
    showLoadingCircular: Function;
    joinDirectory: Function;
    currentRootDirectory: string;
}

export interface FoldersTreeObjectTypes {
    [key: string]: Array<FileType>;
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
    showFileManager: (v: FileManagerProps) => void,
}
