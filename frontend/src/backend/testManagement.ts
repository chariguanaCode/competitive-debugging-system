import { TaskState, Task } from 'reduxState/models';
import { useTaskStatesActions } from 'reduxState/actions';
import { useAllTasksState } from 'reduxState/selectors';
import { compareFiles } from './asyncFileActions';

let hrstart: [number, number];

export const useBeginTest = () => {
    const { reloadTasks } = useTaskStatesActions();
    const taskStates = useAllTasksState();

    return (id: number) => (childProcess: any) => {
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

    return (id: number, outputPath: string, outputToComparePath: string | null) => () => {
        const asyncInside = async () => {
            const execTime = window.process.hrtime(taskStates.current[id].startTime);

            let isAnswerRight: number = -1;
            if (outputToComparePath) isAnswerRight = Number(await compareFiles(outputPath, outputToComparePath, true));

            const finalTaskState: TaskState =
                isAnswerRight == -1
                    ? TaskState.Successful
                    : isAnswerRight == 0
                    ? TaskState.WrongAnswer
                    : isAnswerRight == 1
                    ? TaskState.Successful
                    : TaskState.Successful;

            taskStates.current[id] = {
                state: finalTaskState,
                childProcess: null,
                executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
            } as Task;

            reloadTasks();
        };
        asyncInside();
    };
};
export const useKillTest = () => {
    const { reloadTasks } = useTaskStatesActions();
    const taskStates = useAllTasksState();

    return (id: number) => () => {
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

    return (id: number) => (err: any) => {
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
