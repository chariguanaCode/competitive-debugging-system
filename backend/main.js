const fileChangeTracking = require('./fileChangeTracking')
const compilationAndExecution = require('./cppCompilationAndExecution')
const webserver = require('./webserver')
const loadDirectory = require('./handleTests').loadDirectory
const loadTests = require('./handleTests').loadTests
const loadTestsCANCEL = require('./handleTests').loadTestsCANCEL
const asyncFileActions = require('./asyncFileActions')
const watchParse = require('./watchParse')

var hrstart
let config
let fileTracking
let testChanges = { }
let detailedTestChanges = { }
let currentId = "./cpp/tests/test1.in"

logTest = () => {
    if (Object.entries(testChanges).length !== 0) {
        console.log(testChanges)
        //console.log(process.hrtime(hrstart), { [id]: output })
        webserver.updateTestOverview(testChanges)
        testChanges = { }
    }

    if (Object.entries(detailedTestChanges).length !== 0) {
        webserver.updateDetailedTest(detailedTestChanges)
        detailedTestChanges = { }
    }
}

setInterval(logTest, 500)

const overviewStates = [ "state", "startTime", "executionTime", "error" ]
const detailedStates = [ "state", "startTime", "executionTime", "error", "stdout", "watchblocks" ]
updateTestState = (id, data) => {
    for (const propId in data) {
        if (data.hasOwnProperty(propId)) {
            const val = data[propId];

            config.tests[id][propId] = val

            if (overviewStates.indexOf(propId) > -1) {
                if (!testChanges[id]) testChanges[id] = { }
                testChanges[id][propId] = val
            }

            if (id === currentId && detailedStates.indexOf(propId) > -1) {
                detailedTestChanges[propId] = val
            }
        }
    }
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
    if (!stdout.length) return

    config.tests[id].stdout = Buffer.concat([ config.tests[id].stdout, stdout ])
    //console.log(id, ":", `"${stdout}"`)
}

beginTest = (id) => (childProcess) => {
    updateTestState(id, {
        state: "running",
        childProcess,
        stdout: Buffer.from(""),
        watchblocks: { },
        startTime: process.hrtime()
    })
    //setTimeout(killTest(id), 5000)
    //logTest(id)
}

finishTest = (id) => () => {
    execTime = process.hrtime(config.tests[id].startTime)
    const { watchblocks, stdout } = watchParse.parse(config.tests[id].stdout)
    updateTestState(id, {
        state: "success",
        childProcess: null,
        watchblocks,
        stdout,
        executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`
    })
    //logTest(id)
}

killTest = (id) => () => {
    console.log(process.hrtime(hrstart), "killed", id); 
    config.tests[id].childProcess.kill()
    updateTestState(id, {
        state: "killed",
        childProcess: null,
    })
}

testError = (id) => (err) => {
    if (config.tests[id].state === "running") {
        updateTestState(id, {
            state: "crashed",
            childProcess: null,
            error: { code: err.code, signal: err.signal, stderr: err.stderr }
        })
    }

    execTime = process.hrtime(config.tests[id].startTime)
    updateTestState(id, {
        executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`
    })
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
    const projectFile = config.sourceFile.replace(/\.cpp$/, ".json")
    await asyncFileActions.saveFile(projectFile, JSON.stringify(config))

    loadConfig(config.sourceFile)
}

loadConfig = async (sourceFile) => {
    console.log('Loading config...', sourceFile)
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
    console.log('Read config!')

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
    console.log('Loaded config!')
    webserver.sendConfig(config)
    detailedTestChanges = { }
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
    loadTestsCANCEL
})



exports.loadConfig = loadConfig
exports.loadProject = loadProject
exports.addTestFiles = addTestFiles
