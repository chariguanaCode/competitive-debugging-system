const fileChangeTracking = require('./fileChangeTracking')
const compilationAndExecution = require('./cppCompilationAndExecution')
const webserver = require('./webserver')

var hrstart
let config
let fileTracking

logTest = (id) => {
    let { childProcess, ...output } = config.tests[id]
    console.log(process.hrtime(hrstart), { [id]: output })
    webserver.updateTest(id, config.tests[id])
}

updateExecutionState = (type, details) => {
    switch (type) { 
        case "compilationBegin":
            console.log("Compiling...")
            break;
        case "compilationSuccess":
            console.log("Compilation successful!", details)
            break;
        case "compilationError":
            console.log("Compilation failed!", details)
            break;
    }
    webserver.updateExecutionState(type, details)
}

updateStdout = (id) => (stdout) => {
    if (!stdout) return
    config.tests[id].stdout += stdout
    //console.log(id, ":", `"${stdout}"`)
}

beginTest = (id) => (childProcess) => {
    config.tests[id].stdout = ""
    config.tests[id].childProcess = childProcess
    config.tests[id].state = "running"
    config.tests[id].startTime = process.hrtime()
    //setTimeout(killTest(id), 5000)
    logTest(id)
}

finishTest = (id) => () => {
    config.tests[id].childProcess = null
    config.tests[id].state = "success"
    execTime = process.hrtime(config.tests[id].startTime)
    config.tests[id].executionTime = `${execTime[0]}s ${execTime[1] / 1000000}ms`
    logTest(id)
}

killTest = (id) => () => {
    console.log(process.hrtime(hrstart), "killed", id); 
    config.tests[id].state = "killed"
    config.tests[id].childProcess.kill()
}

testError = (id) => (err) => {
    if (config.tests[id].state === "running") {
        config.tests[id].state = "crashed"
        config.tests[id].error = { code: err.code, signal: err.signal, stderr: err.stderr }
    }

    execTime = process.hrtime(config.tests[id].startTime)
    config.tests[id].executionTime = `${execTime[0]}s ${execTime[1] / 1000000}ms`
    logTest(id)
}

runTasks = () => {
    if (!config) {
        webserver.sendError("No project selected!", "")
        return
    }

    Object.entries(config.tests).forEach(([ id, test ]) => {
        if (test.childProcess) {
            test.childProcess.kill()
        }
    })

    loadConfig(config.filename)
    hrstart = process.hrtime()

    compilationAndExecution(
        config.filename,
        config.tests,
        updateExecutionState,
        beginTest,
        updateStdout,
        finishTest,
        testError
    )
}

loadConfig = (filename) => {
    config = {  
        tests: ["2000000000 2", "3 3", "1200000000 3", "5102028381 10", "60 7", "13 37", "10 0"]
            .map((input) => ({ stdin: input, state: "pending" }))
            .reduce((obj, curr, index) => ({ ...obj, [index]: curr }), { }),
       filename,
    }
    webserver.sendConfig(config)
}

loadProject = (filename) => {
    if (fileTracking) {
        fileTracking.close()
    }

    loadConfig(filename)
    fileTracking = fileChangeTracking.track(config.filename, runTasks, (err) => console.log(err))
    runTasks()
}

webserver.setExecuteTask({
    loadProject,
    runTasks,
    killTest,
})