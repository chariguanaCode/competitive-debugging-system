import useCompilationAndExecution from './cppCompilationAndExecution';
import { useConfig, useAllTasksState } from 'reduxState/selectors';
import { useTaskStatesActions } from 'reduxState/actions';
import { Task, TaskState } from 'reduxState/models';

export const useRunTests = () => {
    const config = useConfig();
    const taskStates = useAllTasksState();
    const { reloadTasks } = useTaskStatesActions();
    const compilationAndExecution = useCompilationAndExecution();

    return (testsToRun?: { [key: string]: string[] }) => {
        if (!config) return;
        
        if (!testsToRun) {
            testsToRun = {};
            for (const groupId in config.tests.groups) {
                testsToRun[groupId] = Object.keys(config.tests.groups[groupId].tests);
            }
        }

        for (const groupId in testsToRun) {
            for (const testId of testsToRun[groupId]) {
                if (taskStates.current[testId]?.childProcess) taskStates.current[testId].childProcess.kill();

                taskStates.current[testId] = {
                    state: TaskState.Pending,
                } as Task;
            }
        }

        reloadTasks();
        compilationAndExecution(testsToRun);
    };
};
