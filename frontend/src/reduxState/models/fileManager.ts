export interface FileManagerModel {
    minNumberOfSelectedFiles?: number;
    maxNumberOfSelectedFiles?: number;
    selectFiles?: (arg1: Array<string>) => any;
    directoryOnStart?: string;
    visibleFilesExtensions?: Array<string>;
    acceptableFilesExtensions?: Array<string>;
    open?: boolean;
}
