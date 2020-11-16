import { FileManagerModel } from 'reduxState/models';
import { AdditionFormStateModel, AdditionFormPropsModel } from '../AdditionForm/AdditionForm.d';
export interface FormPropsModel {
    setFileManager: AdditionFormPropsModel.setFileManager;
    title: AdditionFormPropsModel.tilte;
    setSelectedFiles: AdditionFormPropsModel.setSelectedFiles;
    mirrored: boolean;
}

export interface FormStateModel {
    pendingFiles: Array<FileModel>;
    regex: string;
}
