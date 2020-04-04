const cppActions = require('./cppActions')
const PromiseQueue = require('./parallelPromiseQueue')
const {
    updateExecutionState,
    beginTest,
    updateStdout,
    finishTest,
    testError,
} = require('./testManagement')
const state = require('./state')

module.exports = async () => {
    let filename = state.config.sourceFile
    let tests = state.config.tests
    try {
        updateExecutionState('compilationBegin', '')
        var hrstart = process.hrtime()
        const binaryName = await cppActions.compileCpp(filename).then(
            (result) => result,
            (stderr) => {
                updateExecutionState('compilationError', stderr)
                throw new Error()
            }
        )
        var hrend = process.hrtime(hrstart)
        updateExecutionState(
            'compilationSuccess',
            `Took ${hrend[0]}s ${hrend[1] / 1000000}ms`
        )

        console.log('Running tests...')

        const testPromises = new PromiseQueue(3)
        await Promise.all(
            Object.entries(tests).map(([id, test]) =>
                testPromises
                    .enqueue(
                        () =>
                            cppActions.executeTest(
                                binaryName,
                                test.stdin,
                                updateStdout(id)
                            ),
                        beginTest(id)
                    )
                    .then(finishTest(id), testError(id))
            )
        )
        console.log('Testing successful!')
        console.log('Everything finished!')
    } catch (err) {}
}
