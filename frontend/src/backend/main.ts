import useCompilationAndExecution from './cppCompilationAndExecution';
import * as fileChangeTracking from './fileChangeTracking';
import * as asyncFileActions from './asyncFileActions';
import { useConfig, useAllTasksState } from 'reduxState/selectors';
import { useConfigActions, useTaskStatesActions } from 'reduxState/actions';
import { Task, TaskState } from 'reduxState/models';

/*
const loadDirectory = require('./handleTests').loadDirectory
const loadFilesOnDirectory = require('./handleTests').loadFilesOnDirectory
const loadTests = require('./handleTests').loadTests
const loadTestsCANCEL = require('./handleTests').loadTestsCANCEL
*/

const useRunTasks = () => {
    const config = useConfig();
    const taskStates = useAllTasksState();
    const { reloadTasks } = useTaskStatesActions();
    const compilationAndExecution = useCompilationAndExecution();

    return () => {
        if (!config) {
            //webserver.sendError('No project selected!', '')
            return;
        }

        for (const id in taskStates.current) {
            if (Object.prototype.hasOwnProperty.call(taskStates.current, id)) {
                if (taskStates.current[id].childProcess) {
                    taskStates.current[id].childProcess.kill();
                }

                taskStates.current[id] = {
                    state: TaskState.Pending,
                } as Task;
            }
        }

        reloadTasks();
        compilationAndExecution();
    };
};

const useAddTestFiles = () => {
    const config = useConfig();
    const { setConfig } = useConfigActions();

    if (!config) return;
    return async (testPaths: Array<string>) => {
        let newTests: { [key: string]: { filePath: string } } = {};
        testPaths.forEach((val) => {
            newTests[val] = { filePath: val };
        });

        const newConfig = {
            ...config,
            tests: {
                ...config.tests,
                ...newTests,
            },
        };

        const projectFile = config.projectInfo.files[0].replace(/\.cpp$/, '.json');
        await asyncFileActions.saveFile(projectFile, JSON.stringify(newConfig));

        setConfig(newConfig);
    };
};

/*
const loadTestsMain = (obj) => {
    loadTests(obj, addTestFiles)
}
*/

export { useRunTasks, useAddTestFiles };
