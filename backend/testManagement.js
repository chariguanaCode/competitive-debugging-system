const webserver = require('./webserver')
const watchParse = require('./watchParse')
const state = require('./state')

var hrstart
logTest = () => {
    if (Object.entries(state.testChanges).length !== 0) {
        console.log(state.testChanges)
        //console.log(process.hrtime(hrstart), { [id]: output })
        webserver.updateTestOverview(state.testChanges)
        state.testChanges = {}
    }

    if (Object.entries(state.detailedTestChanges).length !== 0) {
        webserver.updateDetailedTest(state.detailedTestChanges)
        state.detailedTestChanges = {}
    }
}

setInterval(logTest, 500)

const overviewStates = ['state', 'startTime', 'executionTime', 'error']
const detailedStates = [
    'state',
    'startTime',
    'executionTime',
    'error',
    'stdout',
    'watchblocks',
]

updateTestState = (id, data) => {
    console.log(id, data)
    for (const propId in data) {
        if (data.hasOwnProperty(propId)) {
            const val = data[propId]

            state.config.tests[id][propId] = val

            if (overviewStates.indexOf(propId) > -1) {
                if (!state.testChanges[id]) state.testChanges[id] = {}
                state.testChanges[id][propId] = val
            }

            if (id === state.currentId && detailedStates.indexOf(propId) > -1) {
                state.detailedTestChanges[propId] = val
            }
        }
    }
}

updateExecutionState = (type, details) => {
    switch (type) {
        case 'compilationBegin':
            console.log('Compiling...')
            break
        case 'compilationSuccess':
            console.log('Compilation successful!', details)
            break
        case 'compilationError':
            console.log('Compilation failed!', details)
            break
    }
    webserver.updateExecutionState(type, details)
}

updateStdout = (id) => (stdout) => {
    if (!stdout.length) return

    state.config.tests[id].stdout = Buffer.concat([
        state.config.tests[id].stdout,
        stdout,
    ])
    //console.log(id, ":", `"${stdout}"`)
}

beginTest = (id) => (childProcess) => {
    updateTestState(id, {
        state: 'running',
        childProcess,
        stdout: Buffer.from(''),
        watchblocks: {},
        startTime: process.hrtime(),
    })
    console.log('Test began:', state.config.tests[id])
    //setTimeout(killTest(id), 5000)
    //logTest(id)
}

finishTest = (id) => () => {
    execTime = process.hrtime(state.config.tests[id].startTime)
    const { watchblocks, stdout } = watchParse.parse(
        state.config.tests[id].stdout
    )
    updateTestState(id, {
        state: 'success',
        childProcess: null,
        watchblocks,
        stdout,
        executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
    })
    //logTest(id)
}

killTest = (id) => () => {
    console.log(process.hrtime(hrstart), 'killed', id)
    state.config.tests[id].childProcess.kill()
    updateTestState(id, {
        state: 'killed',
        childProcess: null,
    })
}

testError = (id) => (err) => {
    if (state.config.tests[id].state === 'running') {
        updateTestState(id, {
            state: 'crashed',
            childProcess: null,
            error: { code: err.code, signal: err.signal, stderr: err.stderr },
        })
    }

    execTime = process.hrtime(state.config.tests[id].startTime)
    updateTestState(id, {
        executionTime: `${execTime[0]}s ${execTime[1] / 1000000}ms`,
    })
    //logTest(id)
}

module.exports = {
    logTest,
    updateTestState,
    updateExecutionState,
    updateStdout,
    beginTest,
    finishTest,
    killTest,
    testError,
}
