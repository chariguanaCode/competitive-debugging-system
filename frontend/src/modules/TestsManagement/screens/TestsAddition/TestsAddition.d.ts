import { FileModel } from 'components/FileManager/FileManager.d';
export interface TasksAdditionPropsModel {
    closeDialog: () => any;
}
export type MergedFilesModel = {
    inputPath: FileModel;
    outputPath: FileModel | null;
    name: string;
};
export interface TasksAdditionStateModel {
    inputsFiles: Array<FileModel>;
    outputsFiles: Array<FileModel>;
    mergedFiles: Array<MergedFilesModel>;
    selectedTestsGroupId: string;
}
