import useCompilationAndExecution from './cppCompilationAndExecution';
import * as fileChangeTracking from './fileChangeTracking';
import * as syncFileActions from './syncFileActions';
import * as asyncFileActions from './asyncFileActions';
import { ConfigModel, AllTasksModel, Task, TaskState, ProjectFileModel, TrackedObjectsModel } from 'reduxState/models';
import { useConfig, useAllTasksState, useCdsConfig, useProjectFile } from 'reduxState/selectors';
import {
    useConfigActions,
    useTaskStatesActions,
    useProjectFileActions,
    useCdsConfigActions,
    useTrackedObjectsActions,
} from 'reduxState/actions';
import { getTimeMark } from 'utils/tools';
import { getDefaultConfig } from 'data';
const remote = window.require('electron').remote;
const md5 = window.require('md5');

export const useSaveTemporaryProjectFile = () => {
    const projectFile = useProjectFile();
    const config = useConfig();
    const { setProjectFileSaveState } = useProjectFileActions();

    return async () => {
        if (!projectFile) return;
        // TODO: handling errors
        await asyncFileActions.saveFile(projectFile.path, JSON.stringify(config)).catch();
        setProjectFileSaveState(md5(JSON.stringify(config)) === projectFile.savedFileHash);
        return projectFile.path;
    };
};

export const useSaveProjectAs = () => {
    const config = useConfig();

    return async (directory: string, name: string) => {
        if (!(await syncFileActions.isDirectory(directory))) {
            return;
        }
        const path = directory + name + '.cdsp';
        syncFileActions.saveFile(path, JSON.stringify(config));
        return path;
    };
};

export const useSaveProject = () => {
    const projectFile = useProjectFile();
    const config = useConfig();
    const { updateProjectFile } = useProjectFileActions();

    return async () => {
        if (!projectFile) return;
        // TODO: handling errors
        const path = projectFile.directory + projectFile.filename + '.cdsp';
        const stringifiedConfig = JSON.stringify(config);
        await asyncFileActions.saveFile(projectFile.directory + projectFile.filename + '.cdsp', stringifiedConfig).catch();
        updateProjectFile({
            isSaved: true,
            savedFileHash: md5(stringifiedConfig),
        } as ProjectFileModel);
        return path;
    };
};

export const useSaveNotSavedProjectFile = () => {
    const config = useConfig();
    const cdsConfig = useCdsConfig();
    return async () => {
        const path = `${remote.getGlobal('paths').notSavedProjects}/${getTimeMark()}.nsp.cdsp`;
        syncFileActions.saveFile(path, JSON.stringify(config));
        return path;
    };
};

export const useLoadProject = () => {
    const { setConfig } = useConfigActions();
    const taskStates = useAllTasksState();
    const { reloadTasks } = useTaskStatesActions();
    const { setProjectFile } = useProjectFileActions();
    const { pushProjectToProjectsHistory } = useCdsConfigActions();
    const { setAllTrackedObjects } = useTrackedObjectsActions();

    return async (sourceFilePath: string) => {
        let path = syncFileActions.parsePath(sourceFilePath);
        path = path.slice(0, path.length - 1);
        console.log('Loading config...', path);

        // TODO: errors handling
        if (!(await syncFileActions.fileExist(path))) {
            console.error("This file doesn't exist");
            return;
        }

        if (!path.match(/.*\.cdsp/)) {
            console.log('This is not a cdsp file');
            return;
        }
        if (path.match(/.*\.temp.cdsp/)) {
            console.log(".temp.cdsp files shouldn't be opened like that");
            return;
        }

        const hasSaveLocation = !path.match(/.*\.nsp.cdsp/);
        let newConfig: ConfigModel = getDefaultConfig() as ConfigModel;
        let newConfigMD5: number = 0;
        await syncFileActions.readFile(path).then((data: any) => {
            newConfig = Object.assign(newConfig, JSON.parse(data));
            newConfigMD5 = md5(data);
            console.log('Read config');
            console.log('Loaded config');
        });
        let dividedPath = path.split('/');
        const filenameWithExtension = dividedPath[dividedPath.length - 1];
        const filename = filenameWithExtension.slice(0, -5);
        const directory = dividedPath.slice(0, -1).join('/') + '/';
        if (hasSaveLocation) pushProjectToProjectsHistory(directory + filename + '.cdsp');
        console.log(newConfig, dividedPath);

        setConfig(newConfig);
        setProjectFile({
            path: directory + filename + '.temp.cdsp',
            directory: directory,
            filename: filename,
            isSaved: hasSaveLocation,
            hasSaveLocation: hasSaveLocation,
            savedFileHash: newConfigMD5,
        });

        const newTrackedObjects = {} as TrackedObjectsModel;
        for (const { name, type } of newConfig.trackedObjects) {
            switch (type) {
                case 'array_1d':
                    newTrackedObjects[name] = { type, value: [] as string[], color: [] as string[] };
                    break;
                case 'array_2d':
                    newTrackedObjects[name] = { type, value: [[]] as string[][], color: [[]] as string[][] };
                    break;
            }
        }
        setAllTrackedObjects(newTrackedObjects);

        // TODO: rozdzielic do innej funkcji
        taskStates.current = [];
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
