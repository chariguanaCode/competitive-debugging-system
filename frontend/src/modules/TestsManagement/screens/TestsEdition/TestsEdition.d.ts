export interface TestsEditionPropsModel {
    testId?: string;
    groupId?: string;
    closeTestEditionDialog: () => void;
}

export interface TestsEditionStateModel {
    name: string;
    inputPath: string;
    outputPath: string;
    groupId: string;
}
