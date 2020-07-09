import { useContextSelector } from 'use-context-selector';
import GlobalStateContext, { Task, TaskState } from '../utils/GlobalStateContext';
import useCompilationAndExecution from './cppCompilationAndExecution';
import * as fileChangeTracking from './fileChangeTracking';
import * as asyncFileActions from './asyncFileActions';

/*
const loadDirectory = require('./handleTests').loadDirectory
const loadFilesOnDirectory = require('./handleTests').loadFilesOnDirectory
const loadTests = require('./handleTests').loadTests
const loadTestsCANCEL = require('./handleTests').loadTestsCANCEL
*/

const useRunTasks = () => {
    const config = useContextSelector(GlobalStateContext, (v) => v.config);
    const taskStates = useContextSelector(GlobalStateContext, (v) => v.taskStates);
    const reloadTasks = useContextSelector(GlobalStateContext, (v) => v.reloadTasks);
    const compilationAndExecution = useCompilationAndExecution();

    return () => {
        if (!config) {
            //webserver.sendError('No project selected!', '')
            return;
        }

        Object.keys(taskStates.current).forEach((id) => {
            if (taskStates.current[id].childProcess) {
                taskStates.current[id].childProcess.kill();
            }

            taskStates.current[id] = {
                state: TaskState.Pending,
            } as Task;
        });

        reloadTasks();
        compilationAndExecution();
    };
};

const useAddTestFiles = () => {
    const config = useContextSelector(GlobalStateContext, (v) => v.config);
    const setConfig = useContextSelector(GlobalStateContext, (v) => v.setConfig);

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
