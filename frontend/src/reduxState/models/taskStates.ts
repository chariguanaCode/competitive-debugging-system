import { ConvertResult } from 'backend/watchParse';

export type Watch = {
    call_id: string;
    line: string;
    data_type: string;
    config: any;
} & ConvertResult;

export interface Watchblock {
    id: string; //to be removed
    call_id: string;
    children: Array<Watchblock | Watch>;
    type: 'watchblock';
    line: string;
    name: string;
    state: {
        expanded: boolean;
    };
    //config: any;
}

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

export type AllTasksModel = Array<Task>;

export interface CurrentTaskModel {
    id: number;
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
        reload: number;
    };
    currentTask: CurrentTaskModel;
}
