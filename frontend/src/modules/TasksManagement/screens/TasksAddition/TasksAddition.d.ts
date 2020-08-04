import { FileModel } from 'components/FileManager/FileManager.d';
export interface TasksAdditionPropsModel {}
export type MergedFilesModel = {
    inputPath: FileModel;
    outputPath: FileModel | null;
};
export interface TasksAdditionStateModel {
    inputsFiles: Array<FileModel>;
    outputsFiles: Array<FileModel>;
    mergedFiles: Array<MergedFilesModel>;
}
