import { TaskState, Task } from 'reduxState/models';
import { useTaskStatesActions } from 'reduxState/actions';
import { useAllTasksState } from 'reduxState/selectors';

let hrstart: [number, number];

export const useBeginTest = () => {
    const { reloadTasks } = useTaskStatesActions();
    const taskStates = useAllTasksState();

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

export const useFinishTest = () => {
    const { reloadTasks } = useTaskStatesActions();
    const taskStates = useAllTasksState();

    return (id: string) => () => {
        const execTime = window.process.hrtime(taskStates.current[id].startTime);
        console.log(taskStates.current[id]);

        taskStates.current[id] = {
            state: TaskState.Successful,
            childProcess: null,
            executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
        } as Task;

        reloadTasks();
    };
};

export const useKillTest = () => {
    const { reloadTasks } = useTaskStatesActions();
    const taskStates = useAllTasksState();

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

export const useTestError = () => {
    const { reloadTasks } = useTaskStatesActions();
    const taskStates = useAllTasksState();

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
