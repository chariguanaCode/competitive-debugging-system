import useCompilationAndExecution from './cppCompilationAndExecution';
import * as fileChangeTracking from './fileChangeTracking';
import * as asyncFileActions from './asyncFileActions';
import defaultConfig from '../data/defaultConfig.json';
import { ConfigModel, AllTasksModel, Task, TaskState } from 'reduxState/models';
import { useConfig, useAllTasksState, useCdsConfig, useProjectFile } from 'reduxState/selectors';
import { useConfigActions, useTaskStatesActions, useProjectFileActions } from 'reduxState/actions';
import { pathToFileURL } from 'url';

export const useSaveProjectAs = () => {
    const config = useConfig();

    return async (directory: string, name: string) => {
        if (!(await asyncFileActions.isDirectory(directory))) {
            return;
        }
        const path = directory + name;
        console.log(path);
        asyncFileActions.saveFile(path, JSON.stringify(config));
        return path;
    };
};

export const useSaveProject = () => {
    const projectFile = useProjectFile();
    const config = useConfig();
    const { setProjectFileSaveState } = useProjectFileActions();

    return async () => {
        if (!projectFile) return;
        // TODO: handling errors
        const path = projectFile.directory + projectFile.filename + '.cdsp';
        asyncFileActions.saveFile(projectFile.directory + projectFile.filename + '.cdsp', JSON.stringify(config));
        setProjectFileSaveState(true);
        return path;
    };
};

export const useSaveNotSavedProjectFile = () => {
    const config = useConfig();
    const cdsConfig = useCdsConfig();
    return async () => {
        const path = cdsConfig.projects.notSavedProjectDirectory + cdsConfig.projects.nextNotSavedProjectName + '.nsp.cdsp';
        asyncFileActions.saveFile(path, JSON.stringify(config));
        return path;
    };
};

export const useLoadProject = () => {
    const { setConfig } = useConfigActions();
    const taskStates = useAllTasksState();
    const { reloadTasks } = useTaskStatesActions();
    const { setProjectFile } = useProjectFileActions();

    return async (sourceFilePath: string) => {
        let path = asyncFileActions.parsePath(sourceFilePath);
        path = path.slice(0, path.length - 1);
        console.log('Loading config...', path);

        // TODO: errors handling
        if (!(await asyncFileActions.fileExist(path))) {
            console.error("This file doesn't exist");
            return;
        }
        console.log(path)
        if (!path.match(/.*\.cdsp/)) {
            console.log('This is not a cdsp file');
            return;
        }
        if (path.match(/.*\.temp.cdsp/)) {
            console.log(".temp.cdsp files shouldn't be opened like that");
            return;
        }

        const hasSaveLocation = !path.match(/.*\.nsp.cdsp/);
        let newConfig: ConfigModel = defaultConfig;

        await asyncFileActions.readFile(path).then((data: any) => {
            console.log('xd');
            newConfig = JSON.parse(data);
            console.log('Read config');
            console.log('Loaded config');
        });
        let dividedPath = path.split('/');
        const filenameWithExtension = dividedPath[dividedPath.length - 1];
        const filename = filenameWithExtension.slice(0, -5);
        const directory = dividedPath.slice(0, -1).join('/') + '/';
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
        console.log('xd')
        console.log(sourceFilePath)
        setConfig(newConfig);
        setProjectFile({
            path: directory + filename + '.temp.cdsp',
            directory: directory,
            filename: filename,
            isSaved: hasSaveLocation,
            hasSaveLocation: hasSaveLocation,
        });

        // TODO: rozdzielic do innej funkcji
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
