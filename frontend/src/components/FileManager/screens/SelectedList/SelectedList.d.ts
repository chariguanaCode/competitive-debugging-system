import { FileManagerStateModel } from '../../FileManager.d';

export interface SelectedListPropsModel {
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    selectedFiles: FileManagerStateModel['selectedFiles'];
}

export interface SelectedListStateModel {}
