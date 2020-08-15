import { FileManagerStateModel, FileManagerPropsModel } from 'components/FileManager/FileManager.d';

export interface FooterPropsModel {
    minNumberOfSelectedFiles: FileManagerPropsModel['minNumberOfSelectedFiles'];
    selectedFiles: FileManagerPropsModel['selectedFiles'];
    selectFiles: FileManagerPropsModel['selectFiles'];
    dialogClose: FileManagerPropsModel['closeFileManager'];
    withFilesStats: FileManagerPropsModel['withFilesStats'];
}

export interface FooterStateModel {}
