const fileChangeTracking = require('./fileChangeTracking')
const compilationAndExecution = require('./cppCompilationAndExecution')
const webserver = require('./webserver')
const asyncFileActions = require('./asyncFileActions')

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

    loadConfig(config.sourceFile)
    hrstart = process.hrtime()

    compilationAndExecution(
        config.sourceFile,
        config.tests,
        updateExecutionState,
        beginTest,
        updateStdout,
        finishTest,
        testError
    )
}

addTestFiles = async (testPaths) => {
    const newTests = testPaths.map((path) => ({ [path]: { filePath: path } })).reduce((prev, curr) => ({ ...prev, ...curr }), { })

    config.tests = {
        ...config.tests,
        ...newTests
    }

    const projectFile = config.sourceFile.replace(/\.cpp$/, ".json")
    await asyncFileActions.saveFile(projectFile, JSON.stringify(config))

    loadConfig(config.sourceFile)
}

loadConfig = async (sourceFile) => {
    if (!await asyncFileActions.fileExist(sourceFile)) {
        webserver.sendError("The file you provided doesn't exist", "")
        return
    }

    if (!sourceFile.match(/.*\.cpp/)) {
        webserver.sendError("Invalid source file", "")
        return
    }

    const projectFile = sourceFile.replace(/\.cpp$/, ".json")
    if (!await asyncFileActions.fileExist(projectFile)) {
        config = {
            tests: { },
            sourceFile,
        }

        await asyncFileActions.saveFile(projectFile, JSON.stringify(config))
    } else {
        config = JSON.parse(await asyncFileActions.readFile(projectFile))
    }

    const tests = { }
    for (const key in config.tests) {
        if (config.tests.hasOwnProperty(key)) {
            const element = config.tests[key];
            
            if (element.stdin) {
                tests[key] = {
                    stdin: element.stdin,
                    state: "pending"
                }
            } else {
                tests[key] = {
                    stdin: await asyncFileActions.readFile(element.filePath),
                    state: "pending"
                }
            }
        }
    }

    config = {  
        tests,
        sourceFile,
    }
    webserver.sendConfig(config)
}

loadProject = async (sourceFile) => {
    if (fileTracking) {
        fileTracking.close()
    }

    await loadConfig(sourceFile)
    fileTracking = fileChangeTracking.track(config.sourceFile, runTasks, (err) => console.log(err))
    runTasks()
}

webserver.setExecuteTask({
    loadProject,
    runTasks,
    killTest,
})



exports.loadConfig = loadConfig
exports.loadProject = loadProject
exports.addTestFiles = addTestFiles