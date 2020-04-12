import { useContext, useCallback } from 'react'
import GlobalStateContext, {
    Task,
    TaskState,
} from '../utils/GlobalStateContext'
import useCompilationAndExecution from './cppCompilationAndExecution'
import * as fileChangeTracking from './fileChangeTracking'
import * as asyncFileActions from './asyncFileActions'

/*
const loadDirectory = require('./handleTests').loadDirectory
const loadFilesOnDirectory = require('./handleTests').loadFilesOnDirectory
const loadTests = require('./handleTests').loadTests
const loadTestsCANCEL = require('./handleTests').loadTestsCANCEL
*/

const useRunTasks = () => {
    const { config, taskStates, reloadTasks } = useContext(GlobalStateContext)
    const compilationAndExecution = useCompilationAndExecution()

    return useCallback(() => {
        if (!config) {
            //webserver.sendError('No project selected!', '')
            return
        }

        Object.entries(taskStates.current).forEach(([id, test]) => {
            if (test.childProcess) {
                test.childProcess.kill()
            }

            test = {
                state: TaskState.Pending,
            } as Task
        })

        reloadTasks()
        compilationAndExecution()
    }, [config, taskStates, reloadTasks, compilationAndExecution])
}

const useAddTestFiles = () => {
    const { config, setConfig } = useContext(GlobalStateContext)

    return useCallback(
        async (testPaths: Array<string>) => {
            let newTests: { [key: string]: { filePath: string } } = {}
            testPaths.forEach((val) => {
                newTests[val] = { filePath: val }
            })

            const newConfig = {
                ...config,
                tests: {
                    ...config.tests,
                    ...newTests,
                },
            }

            const projectFile = config.sourceFile.replace(/\.cpp$/, '.json')
            await asyncFileActions.saveFile(
                projectFile,
                JSON.stringify(newConfig)
            )

            setConfig(newConfig)
        },
        [config, setConfig]
    )
}

const useLoadConfig = () => {
    const { setConfig, taskStates, reloadTasks } = useContext(
        GlobalStateContext
    )

    return useCallback(
        async (sourceFile: string) => {
            console.log('Loading config...', sourceFile)
            if (!(await asyncFileActions.fileExist(sourceFile))) {
                //webserver.sendError("The file you provided doesn't exist", '')
                return
            }

            if (!sourceFile.match(/.*\.cpp/)) {
                //webserver.sendError('Invalid source file', '')
                return
            }

            const projectFile: string = sourceFile.replace(/\.cpp$/, '.json')
            let newConfig
            if (!(await asyncFileActions.fileExist(projectFile))) {
                newConfig = {
                    tests: {},
                    sourceFile,
                }

                await asyncFileActions.saveFile(
                    projectFile,
                    JSON.stringify(newConfig)
                )
            } else {
                newConfig = JSON.parse(
                    (await asyncFileActions.readFile(projectFile)) as string
                )
            }
            console.log('Read config!')

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

            console.log('Loaded config!', await setConfig(newConfig))
            taskStates.current = newTasks
            reloadTasks()

            //state.detailedTestChanges = {}
        },
        [setConfig, taskStates, reloadTasks]
    )
}

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
            fileChangeTracking.track(config.sourceFile, runTasks, (err: any) =>
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

/*
const loadTestsMain = (obj) => {
    loadTests(obj, addTestFiles)
}
*/

export { useLoadConfig, useReloadProject, useRunTasks, useAddTestFiles }
