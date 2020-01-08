const fileChangeTracking = require('./fileChangeTracking')
const compilationAndExecution = require('./cppCompilationAndExecution')
const webserver = require('./webserver')
const loadDirectory = require('./handleTests').loadDirectory
const loadFilesOnDirectory = require('./handleTests').loadFilesOnDirectory
const loadTests = require('./handleTests').loadTests
const loadTestsCANCEL = require('./handleTests').loadTestsCANCEL
const asyncFileActions = require('./asyncFileActions')

var hrstart
let config
let fileTracking
let testChanges = { }

logTest = () => {
    if (Object.entries(testChanges).length === 0) return
    console.log(testChanges)
    //console.log(process.hrtime(hrstart), { [id]: output })
    webserver.updateTestOverview(testChanges)
    testChanges = { }
}

setInterval(logTest, 500)

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
    if (!testChanges[id]) testChanges[id] = { }
    config.tests[id].stdout = ""
    config.tests[id].childProcess = childProcess
    config.tests[id].state = "running"
    config.tests[id].startTime = process.hrtime()
    testChanges[id].state = "running"
    testChanges[id].startTime = process.hrtime()
    //setTimeout(killTest(id), 5000)
    //logTest(id)
}

finishTest = (id) => () => {
    if (!testChanges[id]) testChanges[id] = { }
    config.tests[id].childProcess = null
    config.tests[id].state = "success"
    testChanges[id].state = "success"
    execTime = process.hrtime(config.tests[id].startTime)
    config.tests[id].executionTime = `${execTime[0]}s ${execTime[1] / 1000000}ms`
    testChanges[id].executionTime = `${execTime[0]}s ${execTime[1] / 1000000}ms`
    //logTest(id)
}

killTest = (id) => () => {
    if (!testChanges[id]) testChanges[id] = { }
    console.log(process.hrtime(hrstart), "killed", id); 
    config.tests[id].state = "killed"
    testChanges[id].state = "killed"
    config.tests[id].childProcess.kill()
}

testError = (id) => (err) => {
    if (!testChanges[id]) testChanges[id] = { }
    if (config.tests[id].state === "running") {
        testChanges[id].state = "crashed"
        testChanges[id].error = { code: err.code, signal: err.signal, stderr: err.stderr }
        config.tests[id].state = "crashed"
        config.tests[id].error = { code: err.code, signal: err.signal, stderr: err.stderr }
    }

    execTime = process.hrtime(config.tests[id].startTime)
    config.tests[id].executionTime = `${execTime[0]}s ${execTime[1] / 1000000}ms`
    testChanges[id].executionTime = `${execTime[0]}s ${execTime[1] / 1000000}ms`
    //logTest(id)
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

        delete test.childProcess
        delete test.stdout 
        delete test.startTime
        delete test.executionTime
        test.state = "pending"
    })

    webserver.sendConfig(config)

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
    let newTests = {};
    testPaths.forEach((val)=>{
        newTests[val] = {filePath: val};
    })
    config.tests = {
        ...config.tests,
        ...newTests
    }
    console.log("xd")
    const projectFile = config.sourceFile.replace(/\.cpp$/, ".json")
    console.log("h");
    await asyncFileActions.saveFile(projectFile, JSON.stringify(config))

    loadConfig(config.sourceFile)
}

loadConfig = async (sourceFile) => {
    console.log('loading config', sourceFile)
    if (!(await asyncFileActions.fileExist(sourceFile))) {
        webserver.sendError("The file you provided doesn't exist", "")
        return
    }

    if (!sourceFile.match(/.*\.cpp/)) {
        webserver.sendError("Invalid source file", "")
        return
    }

    const projectFile = sourceFile.replace(/\.cpp$/, ".json")
    if (!(await asyncFileActions.fileExist(projectFile))) {
        config = {
            tests: { },
            sourceFile,
        }

        await asyncFileActions.saveFile(projectFile, JSON.stringify(config))
    } else {
        config = JSON.parse(await asyncFileActions.readFile(projectFile))
    }
    console.log('read config')

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
                const stdin = await asyncFileActions.readFile(element.filePath)
                tests[key] = {
                    stdin,
                    state: "pending"
                }
            }
        }
    }

    config = {  
        tests,
        sourceFile,
    }
    console.log('loaded config')
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

const loadTestsMain = (obj) => {
    loadTests(obj, addTestFiles)
}

webserver.setExecuteTask({
    loadProject,
    runTasks,
    killTest,
    loadDirectory,
    loadTests: loadTestsMain,
    loadFilesOnDirectory,
    loadTestsCANCEL
})



exports.loadConfig = loadConfig
exports.loadProject = loadProject
exports.addTestFiles = addTestFiles
