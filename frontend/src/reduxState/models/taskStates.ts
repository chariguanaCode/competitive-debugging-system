import { ConvertResult } from 'backend/watchParse';

export type Watch = {
    call_id: string;
    variable_id: number;
    line: string;
    data_type: string;
    config: any;
} & ConvertResult;

export interface Watchblock {
    call_id: string;
    children: Array<Watchblock | Watch>;
    type: 'watchblock';
    line: string;
    name: string;
    //config: any;
}

export type WatchNodeData = (Watchblock | Watch) & {
    id: string;
    depth: number;
    bracketState?: boolean;
};

export enum TaskState {
    Pending,
    Running,
    Successful,
    Timeout,
    WrongAnswer,
    Crashed,
    Killed,
}

export interface Task {
    state: TaskState;
    childProcess: any;
    startTime: [number, number];
    executionTime: string;
    error?: {
        code: number;
        signal: string;
        stderr: string;
    };
}

export interface AllTasksModel {
    [id: string]: Task;
}

export interface CurrentTaskModel {
    id: string;
    groupId: string;
    stdout: string;
    stdoutFileSize: number;
    watchblocks: Watchblock;
    watchblockFileSize: number;
}

export interface TaskStateModel {
    allTasks: {
        current: AllTasksModel;
        timeout: NodeJS.Timeout | null;
        shouldReload: boolean;
    };
    reloadAllTasks: number;
    currentTask: CurrentTaskModel;
}
