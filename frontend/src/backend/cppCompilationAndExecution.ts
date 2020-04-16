import { useContext, useCallback } from 'react'
import GlobalStateContext, { ExecutionState } from '../utils/GlobalStateContext'
import * as cppActions from './cppActions'
import PromiseQueue from '../utils/parallelPromiseQueue'
import {
    useUpdateExecutionState,
    useBeginTest,
    useFinishTest,
    useTestError,
} from './testManagement'

export default () => {
    const { config } = useContext(GlobalStateContext)
    const updateExecutionState = useUpdateExecutionState()
    const beginTest = useBeginTest()
    const finishTest = useFinishTest()
    const testError = useTestError()

    return useCallback(async () => {
        const filename = config.projectInfo.files[0]
        const tests = config.tests
        try {
            updateExecutionState(ExecutionState.Compiling, '')
            let hrstart = window.process.hrtime()
            const binaryName = await cppActions.compileCpp(filename).then(
                (result: string) => result,
                (stderr: any) => {
                    updateExecutionState(
                        ExecutionState.CompilationError,
                        stderr
                    )
                    throw new Error()
                }
            )
            let hrend = window.process.hrtime(hrstart)
            updateExecutionState(
                ExecutionState.Running,
                `Took ${hrend[0]}s ${hrend[1] / 1000000}ms`
            )

            console.log('Running tests...')

            console.log('Found tests:', tests)
            const testPromises = new PromiseQueue(3)
            await Promise.all(
                Object.entries(tests).map(([id, { filePath }]) =>
                    testPromises
                        .enqueue(
                            () =>
                                cppActions.executeTest(
                                    binaryName,
                                    filePath,
                                    filePath + '.out',
                                    filePath + '.err'
                                ),
                            beginTest(id)
                        )
                        .then(finishTest(id), testError(id))
                )
            )
            updateExecutionState(ExecutionState.Finished, '')
        } catch (err) {}
    }, [config, updateExecutionState, beginTest, finishTest, testError])
}
