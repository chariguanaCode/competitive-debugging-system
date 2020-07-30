import { FileModel } from 'components/FileManager/FileManager.d';

export interface FilesPropsModel {
    files: Array<FileModel>;
    selectedFiles: Set<string>;
    acceptableFilesExtensions: Set<string> | undefined;
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    setSelectedFiles: (arg1: Set<string>) => any;
    maxNumberOfSelectedFiles: number;
}

export interface HiddenSearchRefModel {
    currentHiddenSearchText: string;
    lastHiddenSearchTime: number;
}
