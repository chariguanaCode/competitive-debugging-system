import { FileManagerStateModel, FileManagerPropsModel } from 'components/FileManager/FileManager.d';

export interface FooterPropsModel {
    minNumberOfSelectedFiles: NonNullable<FileManagerPropsModel['minNumberOfSelectedFiles']>;
    selectedFiles: FileManagerPropsModel['selectedFiles'];
    selectFiles: NonNullable<FileManagerPropsModel['selectFiles']>;
    dialogClose: () => any;
    withFilesStats: FileManagerPropsModel['withFilesStats'];
}

export interface FooterStateModel {}
