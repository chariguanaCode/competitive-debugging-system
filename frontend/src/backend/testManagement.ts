import { useContextSelector } from 'use-context-selector';
import GlobalStateContext, { ExecutionState, TaskState, Task } from '../utils/GlobalStateContext';

let hrstart: [number, number];

const useUpdateExecutionState = () => {
    return (type: ExecutionState, details: string) => {
        switch (type) {
            case ExecutionState.Compiling:
                console.log('Compiling...');
                break;
            case ExecutionState.Running:
                console.log('Compilation successful!', details);
                break;
            case ExecutionState.CompilationError:
                console.log('Compilation failed!', details);
                break;
            case ExecutionState.Finished:
                console.log('Testing successful!');
                console.log('Everything finished!');
                break;
        }
    };
};

const useBeginTest = () => {
    const taskStates = useContextSelector(GlobalStateContext, (v) => v.taskStates);
    const reloadTasks = useContextSelector(GlobalStateContext, (v) => v.reloadTasks);

    return (id: string) => (childProcess: any) => {
        taskStates.current[id] = {
            state: TaskState.Running,
            childProcess,
            startTime: window.process.hrtime(),
        } as Task;
        console.log('Test began:', taskStates.current[id]);

        reloadTasks();
        //setTimeout(killTest(id), 5000)
    };
};

const useFinishTest = () => {
    const taskStates = useContextSelector(GlobalStateContext, (v) => v.taskStates);
    const reloadTasks = useContextSelector(GlobalStateContext, (v) => v.reloadTasks);

    return (id: string) => () => {
        const execTime = window.process.hrtime(taskStates.current[id].startTime);

        taskStates.current[id] = {
            state: TaskState.Successful,
            childProcess: null,
            executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
        } as Task;

        reloadTasks();
    };
};

const useKillTest = () => {
    const taskStates = useContextSelector(GlobalStateContext, (v) => v.taskStates);
    const reloadTasks = useContextSelector(GlobalStateContext, (v) => v.reloadTasks);

    return (id: string) => () => {
        if (taskStates.current[id].state !== TaskState.Running) return;

        console.log(window.process.hrtime(hrstart), 'killed', id);

        taskStates.current[id].childProcess.kill();

        const execTime = window.process.hrtime(taskStates.current[id].startTime);
        taskStates.current[id] = {
            state: TaskState.Killed,
            childProcess: null,
            executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
        } as Task;

        reloadTasks();
    };
};

const useTestError = () => {
    const taskStates = useContextSelector(GlobalStateContext, (v) => v.taskStates);
    const reloadTasks = useContextSelector(GlobalStateContext, (v) => v.reloadTasks);

    return (id: string) => (err: any) => {
        if (taskStates.current[id].state === TaskState.Running) {
            const execTime = window.process.hrtime(taskStates.current[id].startTime);

            taskStates.current[id] = {
                state: TaskState.Crashed,
                childProcess: null,
                error: {
                    code: err.code,
                    signal: err.signal,
                    stderr: err.stderr,
                },
                executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
            } as Task;
        }

        reloadTasks();
    };
};

export { useUpdateExecutionState, useBeginTest, useFinishTest, useKillTest, useTestError };
