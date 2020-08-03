import { FileModel } from 'components/FileManager/FileManager.d';
export interface TasksAdditionPropsModel {
    inputsFiles: Array<FileModel>;
    setInputsPaths: Function;
    outputsFiles: Array<FileModel>;
    setOutputsPaths: Function;
}

export interface TasksAdditionStateModel {}
