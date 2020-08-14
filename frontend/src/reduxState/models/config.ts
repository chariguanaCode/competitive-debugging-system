export interface ProjectInfoModel {
    files: Array<string>;
    name: string;
    author: string;
    createDate: string;
    lastEditDate: string;
    totalTimeSpent: string;
    description: string;
}

export interface TestModel {
    name: string;
    inputPath: string;
    outputPath: string | null;
}

export interface watchIdActionsModel {
    [key: string]: [{
        target: string,
        action: string,
    }]
}

export interface ConfigModel {
    projectInfo: ProjectInfoModel;
    settings: {
        main: {
            darkMode: boolean;
        };
        fileManager: {
            basic: {
                homePath: string;
            };
            developer: {
                renderBlockSize: number;
            };
        };
    };
    tests: Array<TestModel>; 
    watchesIdsActions: watchIdActionsModel;
}
