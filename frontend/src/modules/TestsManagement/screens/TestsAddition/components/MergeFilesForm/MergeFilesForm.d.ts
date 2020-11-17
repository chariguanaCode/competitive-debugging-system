import { TasksAdditionStateModel } from '../../TasksAddition.d';
export interface MergeFilesFormPropsModel {
    mergedFiles: TasksAdditionStateModel.mergedFiles;
    setMergedFiles: (arg1: asksAdditionStateModel.mergedFiles) => any;
    inputsFiles: TasksAdditionStateModel.inputsPaths;
    outputsFiles: TasksAdditionStateModel.outputsPaths;
}
// TODO: add types ^
export interface MergeFilesFormStateModel {
    selectedMergeFunction: string;
    doAddInputsWithoutOutputs: boolean;
}
