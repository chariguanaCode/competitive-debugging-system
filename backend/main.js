const fileChangeTracking = require('./fileChangeTracking')
const compilationAndExecution = require('./cppCompilationAndExecution')
const webserver = require('./webserver')
const loadDirectory = require('./handleTests').loadDirectory
const loadFilesOnDirectory = require('./handleTests').loadFilesOnDirectory
const loadTests = require('./handleTests').loadTests
const loadTestsCANCEL = require('./handleTests').loadTestsCANCEL
const asyncFileActions = require('./asyncFileActions')

const state = require('./state')

runTasks = () => {
    if (!state.config) {
        webserver.sendError('No project selected!', '')
        return
    }

    Object.entries(state.config.tests).forEach(([id, test]) => {
        if (test.childProcess) {
            test.childProcess.kill()
        }

        delete test.childProcess
        delete test.stdout
        delete test.startTime
        delete test.executionTime
        test.state = 'pending'
    })

    webserver.sendConfig()

    hrstart = process.hrtime()

    compilationAndExecution()
}

addTestFiles = async (testPaths) => {
    let newTests = {}
    testPaths.forEach((val) => {
        newTests[val] = { filePath: val }
    })
    state.config.tests = {
        ...config.tests,
        ...newTests,
    }
    const projectFile = state.config.sourceFile.replace(/\.cpp$/, '.json')
    await asyncFileActions.saveFile(projectFile, JSON.stringify(state.config))

    loadConfig(state.config.sourceFile)
}

loadConfig = async (sourceFile) => {
    console.log('Loading config...', sourceFile)
    if (!(await asyncFileActions.fileExist(sourceFile))) {
        webserver.sendError("The file you provided doesn't exist", '')
        return
    }

    if (!sourceFile.match(/.*\.cpp/)) {
        webserver.sendError('Invalid source file', '')
        return
    }

    const projectFile = sourceFile.replace(/\.cpp$/, '.json')
    if (!(await asyncFileActions.fileExist(projectFile))) {
        state.config = {
            tests: {},
            sourceFile,
        }

        await asyncFileActions.saveFile(
            projectFile,
            JSON.stringify(state.config)
        )
    } else {
        state.config = JSON.parse(await asyncFileActions.readFile(projectFile))
    }
    console.log('Read config!')

    const tests = {}
    for (const key in state.config.tests) {
        if (state.config.tests.hasOwnProperty(key)) {
            const element = state.config.tests[key]

            if (element.stdin) {
                tests[key] = {
                    stdin: element.stdin,
                    state: 'pending',
                }
            } else {
                const stdin = await asyncFileActions.readFile(element.filePath)
                tests[key] = {
                    stdin,
                    state: 'pending',
                }
            }
        }
    }

    state.config = {
        tests,
        sourceFile,
    }
    console.log('Loaded config!')
    webserver.sendConfig()
    state.detailedTestChanges = {}
}

loadProject = async (sourceFile) => {
    if (state.fileTracking) {
        state.fileTracking.close()
    }

    await loadConfig(sourceFile)
    state.fileTracking = fileChangeTracking.track(
        state.config.sourceFile,
        runTasks,
        (err) => console.log(err)
    )
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
    loadTestsCANCEL,
})

exports.loadConfig = loadConfig
exports.loadProject = loadProject
exports.addTestFiles = addTestFiles
