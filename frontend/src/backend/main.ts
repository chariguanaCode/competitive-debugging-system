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

            const projectFile = config.projectInfo.files[0].replace(/\.cpp$/, '.json')
            await asyncFileActions.saveFile(
                projectFile,
                JSON.stringify(newConfig)
            )

            setConfig(newConfig)
        },
        [config, setConfig]
    )
}


/*
const loadTestsMain = (obj) => {
    loadTests(obj, addTestFiles)
}
*/

export { useRunTasks, useAddTestFiles }
