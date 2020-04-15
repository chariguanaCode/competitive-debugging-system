//@ts-nocheck
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

}

export const useLoadProject = () => {
    const { setConfig, taskStates, reloadTasks } = useContext(
        GlobalStateContext
    )

    return useCallback(
        async (sourceFilePath: string) => {
            console.log('Loading config...', sourceFilePath)
            if (!(await asyncFileActions.fileExist(sourceFilePath))) {
                //webserver.sendError("The file you provided doesn't exist", '')
                return
            }

            if (!sourceFilePath.match(/.*\.cdsp/)) {
                console.log("this is not cdsp")
                //webserver.sendError('Invalid source file', '')
                return
            }

            let newConfig: ConfigTypes;

            await asyncFileActions.readFile(
                sourceFilePath
            ).then((data: any)=> {
                newConfig = JSON.parse(data);
                console.log('Read config!',      )
                console.log('Loaded config!', setConfig(newConfig))
            })   
            console.log("TEST", newConfig)  
            /*await asyncFileActions.saveFile(
                sourceFilePath,
                JSON.stringify(newConfig)
            )*/
           
            

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

            //state.detailedTestChanges = {}*/
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