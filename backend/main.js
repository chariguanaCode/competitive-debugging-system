const fileChangeTracking = require('./fileChangeTracking')
const compileCpp = require('./compileCpp')
const executeBinary = require('./executeBinary')

throwError = (title) => details => {
    error = { title, details }
    throw error
}

console.log("I'm working!")
const filename = './cpp/test.cpp'
fileChangeTracking.default(filename, async () => {
    try {
        const binaryName = await compileCpp.default(filename)
            .then(
                (result) => result,
                throwError("Compilation failed!")
            )
        console.log("Compilation successful!")

        await executeBinary.default(binaryName)
            .then(
                (result) => console.log(result),
                throwError("Execution failed!")
            )
    } catch (err) {
        console.log(err.title)
        console.log(err.details)
    }
}, (err) => console.log(err))