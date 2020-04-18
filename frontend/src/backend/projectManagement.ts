import { useContextSelector } from 'use-context-selector';
import GlobalStateContext, {
    Task,
    TaskState,
} from '../utils/GlobalStateContext';
import useCompilationAndExecution from './cppCompilationAndExecution';
import * as fileChangeTracking from './fileChangeTracking';
import * as asyncFileActions from './asyncFileActions';
import { Config as ConfigTypes } from '../utils/GlobalStateContext';
import defaultConfig from '../data/defaultConfig.json';

export const useSaveProject = () => {
    const config = useContextSelector(GlobalStateContext, (v) => v.config);

    return async () => {
        let path = asyncFileActions.parsePath(config.projectInfo.path);
        if (!(await asyncFileActions.isDirectory(path))) {
            return;
        }
        return asyncFileActions.saveFile(
            path + config.projectInfo.saveName + '.cdsp',
            JSON.stringify(config)
        );
    };
};

export const useLoadProject = () => {
    const setConfig = useContextSelector(
        GlobalStateContext,
        (v) => v.setConfig
    );
    const taskStates = useContextSelector(
        GlobalStateContext,
        (v) => v.taskStates
    );
    const reloadTasks = useContextSelector(
        GlobalStateContext,
        (v) => v.reloadTasks
    );

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

        let newConfig: ConfigTypes = defaultConfig;

        await asyncFileActions.readFile(path).then((data: any) => {
            newConfig = JSON.parse(data);
            console.log('Read config!');
            console.log('Loaded config!');
        });
        let dividedPath = path.split('/');
        newConfig.projectInfo.saveName = dividedPath[dividedPath.length - 1];
        newConfig.projectInfo.path = dividedPath.slice(0, -1).join('/') + '/';
        console.log(newConfig, dividedPath);
        setConfig(newConfig);

        //rozdzielic do innej funkcji
        const newTasks: {
            [key: string]: Task;
        } = {};
        for (const key in newConfig.tests) {
            if (newConfig.tests.hasOwnProperty(key)) {
                newTasks[key] = {
                    state: TaskState.Pending,
                } as Task;
            }
        }

        taskStates.current = newTasks;
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
