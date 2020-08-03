import { TasksManagementStateModel } from '../../TasksManagement.d';

export interface TasksMergePropsModel {
    inputsFiles: TasksManagementStateModel.inputsPaths;
    outputsFiles: TasksManagementStateModel.outputsPaths;
    showLists?: boolean;
}

export type mergedFilesModel = {
    [key: string]: {
        inputPath: string;
        outputPath: string | null;
    };
};
export interface TasksMergeStateModel {
    selectedMergeFunction: string;
    doAddInputsWithoutOutputs: boolean;
    mergedFiles: mergedFilesModel;
}
