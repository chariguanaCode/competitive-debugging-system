import React, { useState, useRef, MutableRefObject } from 'react'
import defaultConfig from '../data/defaultConfig.json'
interface Props {
    children: any | Array<any>
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

export interface Config {
    "projectInfo": {
        "files": Array<string>,
        "path": string,
        "name": string,
        "author": string,
        "createDate": string,
        "lastEditDate": string,
        "totalTimeSpent": string,
        "description": string
    },
    "settings": {
        "main": {
            "darkMode": Boolean
        },
        "fileManager": {
            "basic": {
                "homePath": string
            },
            "developer": {
                "renderBlockSize": number
            }
        }
    },
    "tests": {
        [key: string]: {
            filePath: string
        }
    }
}

export interface Task {
    state: TaskState
    childProcess: any
    startTime: [number, number]
    executionTime: string
    error?: {
        code: number
        signal: string
        stderr: Uint8Array | string
    }
}

export interface GlobalStateType {
    executionState: ExecutionState
    config: Config
    fileTracking: any
    projectFile: string
    taskStates: MutableRefObject<{
        [key: string]: Task
    }>
    shouldTasksReload: number
    setExecutionState: (newState: ExecutionState) => void
    setConfig: (newConfig: Config) => void
    setFileTracking: (newTracking: any) => void
    setProjectFile: (newSource: string) => void
    reloadTasks: () => void
}

const GlobalStateContext = React.createContext({} as GlobalStateType)

export const GlobalStateProvider = ({ children }: Props) => {
    const [config, setConfig] = useState<Config>({
        "projectInfo": {
            "files":
            ['/home/charodziej/Documents/competitive-debugging-system/cpp/test.cpp'],
        } 
    } as Config)
    const [fileTracking, setFileTracking] = useState<any>(null)
    const [projectFile, setProjectFile] = useState<string>(
        '/home/charodziej/Documents/competitive-debugging-system/cpp/test.cpp'
    )
    const taskStates = useRef<{ [key: string]: Task }>(
        {} as { [key: string]: Task }
    )
    const [executionState, setExecutionState] = useState<ExecutionState>(
        ExecutionState.NoProject
    )
    const [shouldTasksReload, updateTaskCount] = useState(0)
    const reloadTasks = () => {
        updateTaskCount((val) => (val + 1) % 1000000000)
    }

    return (
        <GlobalStateContext.Provider
            value={{
                executionState,
                config,
                fileTracking,
                projectFile,
                taskStates,
                shouldTasksReload,
                setExecutionState,
                setConfig,
                setFileTracking,
                setProjectFile,
                reloadTasks,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    )
}

export default GlobalStateContext
