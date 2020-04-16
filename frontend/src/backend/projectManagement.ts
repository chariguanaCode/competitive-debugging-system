import { useContext, useCallback } from 'react'
import GlobalStateContext, {
    Task,
    TaskState,
} from '../utils/GlobalStateContext'
import useCompilationAndExecution from './cppCompilationAndExecution'
import * as fileChangeTracking from './fileChangeTracking'
import * as asyncFileActions from './asyncFileActions'
import { Config as ConfigTypes} from '../utils/GlobalStateContext'
import defaultConfig from '../data/defaultConfig.json'

export const useSaveProject = () => {
    const { config } = useContext(GlobalStateContext)

    return useCallback(
        async () => {
            let path = asyncFileActions.parsePath(config.projectInfo.path)
            if (!(await asyncFileActions.isDirectory(path))) {
                return
            }
            return asyncFileActions.saveFile(path + config.projectInfo.saveName + '.cdsp', JSON.stringify(config));
        }, [config])
}

export const useLoadProject = () => {
    const { setConfig, taskStates, reloadTasks } = useContext(
        GlobalStateContext
    )

    return useCallback(
        async (sourceFilePath: string) => {
            console.log('Loading config...', sourceFilePath)
            let path = asyncFileActions.parsePath(sourceFilePath)
            if (!(await asyncFileActions.fileExist(path))) {
                return
            }

            if (!path.match(/.*\.cdsp/)) {
                console.log("this is not cdsp")
                return
            }

            let newConfig: ConfigTypes = defaultConfig;

            await asyncFileActions.readFile(
                path
            ).then((data: any)=> {
                newConfig = JSON.parse(data);
                console.log('Read config!')
                console.log('Loaded config!')
            })   
            let dividedPath = path.split('/');
            newConfig.projectInfo.saveName = dividedPath[dividedPath.length - 2]
            newConfig.projectInfo.path = dividedPath.slice(0,-2).join('/')+'/';
            console.log(newConfig, dividedPath)
            setConfig(newConfig)
            //rozdzielic do innej funkcji
            const newTasks: {
                [key: string]: Task
            } = {}
            for (const key in newConfig.tests) {
                if (newConfig.tests.hasOwnProperty(key)) {
                    newTasks[key] = {
                        state: TaskState.Pending,
                    } as Task
                }
            }

            taskStates.current = newTasks
            reloadTasks()
        },
        [setConfig, taskStates, reloadTasks]
    )
}
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