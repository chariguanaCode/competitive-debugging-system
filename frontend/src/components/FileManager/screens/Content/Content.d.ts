import { FileModel } from 'components/FileManager/FileManager.d';

export interface ContentPropsModel {
    files: Array<FileModel>;
    selectedFiles: Set<string>;
    acceptableFilesExtensions: Set<string> | undefined;
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    setSelectedFiles: (arg1: Set<string>) => any;
    maxNumberOfSelectedFiles: number;
    currentPath: string;
    searchText: string;
}

export interface ContentStateModel {}
