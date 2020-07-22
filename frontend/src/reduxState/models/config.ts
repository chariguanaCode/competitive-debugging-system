export interface ConfigModel {
    projectInfo: {
        files: Array<string>;
        saveName: string;
        path: string;
        name: string;
        author: string;
        createDate: string;
        lastEditDate: string;
        totalTimeSpent: string;
        description: string;
    };
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
    tests: {
        [key: string]: {
            filePath: string;
        };
    };
}
