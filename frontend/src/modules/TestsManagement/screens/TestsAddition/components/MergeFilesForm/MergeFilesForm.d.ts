import { TasksAdditionStateModel } from '../../TestsAddition.d';
export interface MergeFilesFormPropsModel {
    mergedFiles: TasksAdditionStateModel['mergedFiles'];
    setMergedFiles: (arg1: TasksAdditionStateModel['mergedFiles']) => any;
    inputsFiles: TasksAdditionStateModel['inputsFiles'];
    outputsFiles: TasksAdditionStateModel['outputsFiles'];
}
// TODO: add types ^
export interface MergeFilesFormStateModel {
    selectedMergeFunction: string;
    selectedDetermineTestDataFunction: string;
    doAddInputsWithoutOutputs: boolean;
}
