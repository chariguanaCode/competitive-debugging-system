const fileChangeTracking = require('./fileChangeTracking')
const cppActions = require('./cppActions')
const PromiseQueue = require('./parallelPromiseQueue')

let tests

logTest = (id) => {
    let { child, ...output } = tests[id]
    console.log({ [id]: output })
}

throwError = (title, id) => err => {
    //console.log(err)
    let error = { title, details: err.stderr }
    console.log(error)
}

updateStdout = (id) => (stdout) => {
    if (!stdout) return
    tests[id].stdout += stdout
    //console.log(id, ":", `"${stdout}"`)
}

beginTest = (id) => (child) => {
    tests[id].stdout = ""
    tests[id].child = child
    tests[id].state = "running"
    setTimeout(killTest(id), 5000)
    logTest(id)
}

finishTest = (id) => () => {
    tests[id].child = null
    tests[id].state = "success"
    logTest(id)
}

killTest = (id) => () => {
    console.log("killed", id); 
    tests[id].state = "killed"
    tests[id].child.kill()
}

const filename = './cpp/test.cpp'
fileChangeTracking.default(filename, async () => {
    try {
        console.log("Compiling...")
        const binaryName = await cppActions.compileCpp(filename)
            .then(
                (result) => result,
                throwError("Compilation failed!")
            )
        console.log("Compilation successful!")

        console.log("Running tests...")
        tests = ["2 2", "3 3", "5 10", "60 7", "12 30", "13 37", "12 34"]
            .map((input) => ({ stdin: input, }))
            .reduce((obj, curr, index) => ({ ...obj, [index]: curr }), { })

        const testPromises = new PromiseQueue(4)
        await Promise.all(Object.entries(tests).map(([ id, test ]) => (
            testPromises.enqueue(() => cppActions.executeTest(binaryName, test.stdin, updateStdout(id)), beginTest(id))
                .then(
                    finishTest(id),
                    (err) => {
                        if (tests[id].state === "running") {
                            tests[id].state = "crashed"
                            tests[id].error = { title: "Execution failed!", details: err.stderr }
                        }
                        logTest(id)
                    }
                )
            )
        ))
        console.log("Testing successful!")
    } catch (err) {
        console.log(err)
        console.log(err.title)
        console.log(err.details)
    }
    console.log("Everything finished!")
}, (err) => console.log(err))