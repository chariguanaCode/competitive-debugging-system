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

type LayoutElement = any;

interface BorderElement {
    type: 'border';
    location: 'top' | 'bottom' | 'left' | 'right';
    children: Array<LayoutElement>;
}

export interface LayoutModel {
    global: any;
    layout: LayoutElement;
    borders: Array<BorderElement>;
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
    layouts: {
        debugging: LayoutModel;
        outputs: LayoutModel;
        tests: LayoutModel;
    };
    layoutSelection: 'debugging' | 'outputs' | 'tests';
}
