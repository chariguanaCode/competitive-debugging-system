import { FileModel } from 'components/FileManager/FileManager.d';

export interface TasksManagementPropsModel {}

export interface TasksManagementStateModel {
    inputsFiles: Array<FileModel>;
    outputsFiles: Array<FileModel>;
}
