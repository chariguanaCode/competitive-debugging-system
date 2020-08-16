import { FileModel, FileManagerStateModel, FileManagerPropsModel } from 'components/FileManager/FileManager.d';

export interface FilesPropsModel {
    files: FileManagerStateModel['files'];
    selectedFiles: FileManagerStateModel['selectedFiles'];
    acceptableFilesExtensions: FileManagerStateModel['acceptableFilesExtensions'];
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    setSelectedFiles: (arg1: FileManagerStateModel['selectedFiles']) => any;
    maxNumberOfSelectedFiles: FileManagerPropsModel['maxNumberOfSelectedFiles'];
    searchText: FileManagerStateModel['searchText'];
    zoomFactor: FileManagerStateModel['zoomFactor'];
}

export interface HiddenSearchRefModel {
    currentHiddenSearchText: string;
    lastHiddenSearchTime: number;
}
