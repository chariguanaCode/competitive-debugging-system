import React, { useState, MutableRefObject, useMemo } from 'react';
import { createContext } from 'use-context-selector';
import { useGrowingFileTrack } from '../backend/outputFileTracking';
import { watchParse, clearWatchblocks } from '../backend/watchParse';
import useMutableStateWithLimitedUpdateFrequency from './useMutableStateWithLimitedUpdateFrequency';
import defaultConfig from '../data/defaultConfig.json';

interface Props {
    children: any | Array<any>;
}

export enum ExecutionState {
    NoProject,
    Compiling,
    CompilationError,
    Running,
    Finished,
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

export interface FileManagerConfigTypes {
    basic: {
        homePath: string;
    };
    developer: {
        renderBlockSize: number;
    };
}

export interface Config {
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
        fileManager: FileManagerConfigTypes;
    };
    tests: {
        [key: string]: {
            filePath: string;
        };
    };
}

export interface Task {
    state: TaskState;
    childProcess: any;
    startTime: [number, number];
    executionTime: string;
    error?: {
        code: number;
        signal: string;
        stderr: Uint8Array | string;
    };
}

export type Watchblocks = any;

export interface TaskDetails {
    id: string;
    stdout: MutableRefObject<string>;
    stdoutFileSize: number;
    watchblocks: MutableRefObject<Watchblocks>;
}

export interface GlobalStateType {
    executionState: ExecutionState;
    config: Config | undefined;
    fileTracking: any;
    projectFile: string;
    taskStates: MutableRefObject<{
        [key: string]: Task;
    }>;
    shouldTasksReload: number;
    currentTask: TaskDetails;
    shouldStdoutReload: number;
    shouldWatchblocksReload: number;
    setExecutionState: (newState: ExecutionState) => void;
    setConfig: (newConfig: Config) => void;
    setFileTracking: (newTracking: any) => void;
    setProjectFile: (newSource: string) => void;
    reloadTasks: () => void;
    setCurrentTaskId: (newTaskId: string) => void;
}

const GlobalStateContext = createContext({} as GlobalStateType);

export const GlobalStateProvider = ({ children }: Props) => {
    const [config, setConfig] = useState<Config | undefined>(undefined);
    const [fileTracking, setFileTracking] = useState<any>(null);
    const [projectFile, setProjectFile] = useState<string>(
        '/home/charodziej/Documents/competitive-debugging-system/cpp/test.cpp'
    );
    const [executionState, setExecutionState] = useState<ExecutionState>(
        ExecutionState.NoProject
    );

    const [
        taskStates,
        shouldTasksReload,
        reloadTasks,
    ] = useMutableStateWithLimitedUpdateFrequency(
        {} as { [key: string]: Task },
        500
    );
    const [currentTaskId, setCurrentTaskId] = useState('');

    const [
        stdout,
        shouldStdoutReload,
        updateStdoutCount,
    ] = useMutableStateWithLimitedUpdateFrequency('', 500);
    const [stdoutFileSize, setStdoutFileSize] = useState(1);

    const [
        watchblocks,
        shouldWatchblocksReload,
        updateWatchblockCount,
    ] = useMutableStateWithLimitedUpdateFrequency('', 500);

    const appendStdout = (newData: Uint8Array) => {
        stdout.current += new TextDecoder('utf-8').decode(newData);
        updateStdoutCount();
    };

    const setWatchblocks = (newWatchblocks: Uint8Array) => {
        watchParse(newWatchblocks);
        updateWatchblockCount();
    };

    useGrowingFileTrack(
        config && currentTaskId !== '' &&
            [TaskState.Running, TaskState.Successful].includes(
                taskStates.current[currentTaskId].state
            )
            ? config.tests[currentTaskId].filePath + '.out'
            : '',
        false,
        currentTaskId !== '' &&
            taskStates.current[currentTaskId].state === TaskState.Successful,
        appendStdout,
        setStdoutFileSize,
        () => {
            stdout.current = '';
            updateStdoutCount();
            setStdoutFileSize(1);
        }
    );

    useGrowingFileTrack(
        config && currentTaskId !== '' &&
            [TaskState.Running, TaskState.Successful].includes(
                taskStates.current[currentTaskId].state
            )
            ? config.tests[currentTaskId].filePath + '.err'
            : '',
        true,
        currentTaskId !== '' &&
            taskStates.current[currentTaskId].state === TaskState.Successful,
        setWatchblocks,
        (x: number) => {},
        () => {
            clearWatchblocks(watchblocks);
            updateWatchblockCount();
        }
    );

    return (
        <GlobalStateContext.Provider
            value={{
                executionState,
                config,
                fileTracking,
                projectFile,
                taskStates,
                shouldTasksReload,
                currentTask: useMemo(
                    () => ({
                        id: currentTaskId,
                        stdout,
                        stdoutFileSize,
                        watchblocks,
                    }),
                    [currentTaskId, stdout, stdoutFileSize, watchblocks]
                ),
                shouldStdoutReload,
                shouldWatchblocksReload,
                setExecutionState,
                setConfig,
                setFileTracking,
                setProjectFile,
                reloadTasks,
                setCurrentTaskId,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

export default GlobalStateContext;
