import { FileManagerStateModel, FileManagerPropsModel } from 'components/FileManager/FileManager.d';

export interface ContentPropsModel {
    files: FileManagerStateModel['files'];
    selectedFiles: FileManagerStateModel['selectedFiles'];
    acceptableFilesExtensions: FileManagerStateModel['acceptableFilesExtensions'];
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    setSelectedFiles: (arg1: FileManagerStateModel.selectedFiles) => any;
    maxNumberOfSelectedFiles: FileManagerPropsModel['maxNumberOfSelectedFiles'];
    currentPath: FileManagerStateModel['currentPath'];
    searchText: string;
    zoomFactor: FileManagerStateModel['zoomFactor'];
    setZoomFactor: (
        newZoomFactor:
            | FileManagerStateModel['zoomFactor']
            | ((arg1: FileManagerStateModel['zoomFactor']) => FileManagerStateModel['zoomFactor'])
    ) => any;
}

export interface ContentStateModel {}
