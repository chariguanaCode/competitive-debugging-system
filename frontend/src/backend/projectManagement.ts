import useCompilationAndExecution from './cppCompilationAndExecution';
import * as fileChangeTracking from './fileChangeTracking';
import * as asyncFileActions from './asyncFileActions';
import defaultConfig from '../data/defaultConfig.json';
import { ConfigModel, AllTasksModel, Task, TaskState } from 'reduxState/models';
import { useConfig, useAllTasksState } from 'reduxState/selectors';
import { useConfigActions, useTaskStatesActions } from 'reduxState/actions';

export const useSaveProject = () => {
    const config = useConfig();

    return async () => {
        let path = asyncFileActions.parsePath(config.projectInfo.path);
        if (!(await asyncFileActions.isDirectory(path))) {
            return;
        }
        return asyncFileActions.saveFile(path + config.projectInfo.saveName + '.cdsp', JSON.stringify(config));
    };
};

export const useLoadProject = () => {
    const { setConfig } = useConfigActions();
    const taskStates = useAllTasksState();
    const { reloadTasks } = useTaskStatesActions();

    return async (sourceFilePath: string) => {
        let path = asyncFileActions.parsePath(sourceFilePath);
        path = path.slice(0, path.length - 1);
        console.log('Loading config...', path);

        if (!(await asyncFileActions.fileExist(path))) {
            console.error("This file doesn't exist");
            return;
        }

        if (!path.match(/.*\.cdsp/)) {
            console.log('This is not a cdsp file');
            return;
        }

        let newConfig: ConfigModel = defaultConfig;

        await asyncFileActions.readFile(path).then((data: any) => {
            newConfig = JSON.parse(data);
            console.log('Read config!');
            console.log('Loaded config!');
        });
        let dividedPath = path.split('/');
        newConfig.projectInfo.saveName = dividedPath[dividedPath.length - 1];
        newConfig.projectInfo.path = dividedPath.slice(0, -1).join('/') + '/';
        console.log(newConfig, dividedPath);
        /*
        const tests = {} as { [key: string]: { filePath: string } };
        for (let i = 0; i < 100; i++) {
            for (const key in newConfig.tests) {
                if (newConfig.tests.hasOwnProperty(key)) {
                    tests[`${key} ${i}`] = newConfig.tests[key];
                }
            }
        }
        newConfig.tests = tests;
        */

        setConfig(newConfig);

        //rozdzielic do innej funkcji
        for (const key in newConfig.tests) {
            if (newConfig.tests.hasOwnProperty(key)) {
                taskStates.current[key] = {
                    state: TaskState.Pending,
                } as Task;
            }
        }

        reloadTasks();
    };
};
/*
const useReloadProject = () => {
    const { projectFile, config, fileTracking, setFileTracking } = useContext(
        GlobalStateContext
    )

    const loadConfig = useLoadConfig()
    const runTasks = useRunTasks()

    return useCallback(async () => {
        if (fileTracking) {
            fileTracking.close()
        }

        await loadConfig(projectFile)
        setFileTracking(
            fileChangeTracking.track(config.projectInfo.files[0], runTasks, (err: any) =>
                console.log(err)
            )
        )
    }, [
        projectFile,
        config,
        fileTracking,
        setFileTracking,
        loadConfig,
        runTasks,
    ])
}
*/
