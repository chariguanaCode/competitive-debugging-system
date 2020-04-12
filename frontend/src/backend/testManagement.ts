import * as watchParse from './watchParse'
import { useCallback, useContext } from 'react'
import GlobalStateContext, {
    ExecutionState,
    TaskState,
    Task,
} from '../utils/GlobalStateContext'

let hrstart: [number, number]

const useUpdateExecutionState = () => {
    return useCallback((type, details: string) => {
        switch (type) {
            case ExecutionState.Compiling:
                console.log('Compiling...')
                break
            case ExecutionState.Running:
                console.log('Compilation successful!', details)
                break
            case ExecutionState.CompilationError:
                console.log('Compilation failed!', details)
                break
            case ExecutionState.Finished:
                console.log('Testing successful!')
                console.log('Everything finished!')
                break
        }
    }, [])
}

const useBeginTest = () => {
    const { taskStates, reloadTasks } = useContext(GlobalStateContext)

    return useCallback(
        (id) => (childProcess: any) => {
            taskStates.current[id] = {
                state: TaskState.Running,
                childProcess,
                startTime: window.process.hrtime(),
            } as Task
            console.log('Test began:', taskStates.current[id])

            reloadTasks()
            //setTimeout(killTest(id), 5000)
        },
        [taskStates, reloadTasks]
    )
}

const useFinishTest = () => {
    const { taskStates, reloadTasks } = useContext(GlobalStateContext)

    return useCallback(
        (id) => () => {
            const execTime = window.process.hrtime(
                taskStates.current[id].startTime
            )

            taskStates.current[id] = {
                state: TaskState.Successful,
                childProcess: null,
                executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
            } as Task

            reloadTasks()
        },
        [taskStates, reloadTasks]
    )
}

const useKillTest = () => {
    const { taskStates, reloadTasks } = useContext(GlobalStateContext)

    return useCallback(
        (id) => () => {
            console.log(window.process.hrtime(hrstart), 'killed', id)

            taskStates.current[id].childProcess.kill()

            const execTime = window.process.hrtime(
                taskStates.current[id].startTime
            )
            taskStates.current[id] = {
                state: TaskState.Killed,
                childProcess: null,
                executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
            } as Task

            reloadTasks()
        },
        [taskStates, reloadTasks]
    )
}

const useTestError = () => {
    const { taskStates, reloadTasks } = useContext(GlobalStateContext)

    return useCallback(
        (id) => (err: any) => {
            if (taskStates.current[id].state === TaskState.Running) {
                taskStates.current[id] = {
                    state: TaskState.Crashed,
                    childProcess: null,
                    error: {
                        code: err.code,
                        signal: err.signal,
                        stderr: err.stderr,
                    },
                } as Task
            }

            const execTime = window.process.hrtime(
                taskStates.current[id].startTime
            )
            taskStates.current[id] = {
                ...taskStates.current[id],
                executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
            } as Task

            reloadTasks()
        },
        [taskStates, reloadTasks]
    )
}

export {
    useUpdateExecutionState,
    useBeginTest,
    useFinishTest,
    useKillTest,
    useTestError,
}
