import { TrackedObject } from './trackedObjects';
import { WatchActionType } from './watchActionsHistory';

export interface ProjectInfoModel {
    files: Array<string>;
    uuid: string;
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

export interface TestGroupsModel {
    groups: {
        [key: string]: {
            name: string;
            timeLimit: string;
            maximumRunningTime: string;
            tests: { [key: string]: TestModel };
        };
    };
    nextTestId: string;
    nextGroupId: string;
}

export interface WatchIdActionsModel {
    [key: string]: Array<{
        target: string;
        action: WatchActionType;
    }>;
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
    tests: TestGroupsModel;
    watchesIdsActions: WatchIdActionsModel;
    layouts: {
        debugging: LayoutModel;
        outputs: LayoutModel;
        tests: LayoutModel;
        empty: LayoutModel;
    };
    layoutSelection: 'debugging' | 'outputs' | 'tests' | 'empty'; // TODO: just string in future
    trackedObjects: Array<{
        name: string;
        type: TrackedObject['type'];
    }>;
}
