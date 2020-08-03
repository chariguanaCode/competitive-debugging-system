import { FileManagerModel } from 'reduxState/models';
import { AdditionFormStateModel, AdditionFormPropsModel } from '../AdditionForm/AdditionForm.d';
export interface FormPropsModel {
    setFileManager: AdditionFormPropsModel.setFileManager;
    setFilteredFiles: (arg1: AdditionFormStateModel.filteredFiles) => any;
    filteredFiles: AdditionFormStateModel.filteredFiles;
    title: AdditionFormPropsModel.tilte;
    regex: AdditionFormStateModel.regex;
    setRegex: (arg1: AdditionFormStateModel.regex) => any;
    pendingFiles: AdditionFormStateModel.pendingFiles;
    setPendingFiles: (arg1: AdditionFormStateModel.pendingFiles) => any;
}

export interface FormStateModel {}
