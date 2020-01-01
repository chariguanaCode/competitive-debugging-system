import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Paper from './Paper'
import ProgramTestComponent from './ProgramTest'
import { CssBaseline, Table, TableContainer, TableRow, TableCell, TableBody } from '@material-ui/core'
import Header from './Header'
import Content from './Content'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import { grey, red, yellow, lightGreen, lightBlue, purple } from '@material-ui/core/colors';

interface ProgramTestData {
    [testName: string]: {
        state: string,
        stdout: string,
        stdin: string,
        error: any,
        executionTime: string,
    }
}

enum ExecutionState {
    NoProject,
    Compiling,
    CompilationError,
    Running,
    Finished,
}

const App: React.FC = () => {
    const [ tests, setTests ] = useState<ProgramTestData>({ })
    const [ filename, setFilename ] = useState("")
    const [ executionState, setExecutionState ] = useState<ExecutionState>(ExecutionState.NoProject)
    const [ socket, setSocket ] = useState()
    const connectionTimeout = useRef(250)

    const check = () => {
        if (!socket || socket.readyState === WebSocket.CLOSED) connect() 
    }

    const connect = () => {
        var ws = new WebSocket("ws://localhost:8000")
        var connectInterval: NodeJS.Timeout

        ws.onopen = () => {
            console.log("connected websocket main component")

            setSocket(ws)

            connectionTimeout.current = 250 
            clearTimeout(connectInterval) 
        }

        ws.onclose = e => {
            connectionTimeout.current = Math.min(10000, 2 * connectionTimeout.current) 

            console.log(
                `Socket is closed. Reconnect will be attempted in ${connectionTimeout.current / 1000} second.`,
                e.reason
            )

            connectInterval = setTimeout(check, connectionTimeout.current) 
        }

        ws.onerror = err => {
            console.error(
                "Socket encountered an error. Closing the socket."
            )

            ws.close()
        }

        ws.onmessage = (msg) => {
            const message = JSON.parse(msg.data)
            console.log(message)
            const type = message.type
            const data = message.data
            if (type === "newConfig") {
                setFilename(data.filename)
                setTests(data.tests)
            }
            if (type === "testUpdate") {
                const newTest: ProgramTestData = {
                    [data.id]: {
                        state: data.state,
                        stdin: data.stdin,
                        stdout: data.stdout,
                        executionTime: data.executionTime,
                        error: data.error
                    }
                }
                setTests((prevTests) => ({ ...prevTests, ...newTest }))
            }
            if (type === "compilationBegin") {
                setExecutionState(ExecutionState.Compiling)
            }
            if (type === "compilationSuccess") {
                setExecutionState(ExecutionState.Running)
            }
            if (type === "compilationError") {
                setExecutionState(ExecutionState.CompilationError)
            }
        }
    }

    useEffect(() => {
        connect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ])

    const loadProject = () => {
        socket.send(JSON.stringify({
            type: "loadProject",
            filename: "./cpp/test.cpp"
        }))
    }

    const runTests = () => {
        socket.send(JSON.stringify({
            type: "runTasks"
        }))
    }

    const killTest = (testName: string) => {
        socket.send(JSON.stringify({
            type: "killTest",
            testName
        }))
    }

    return (
        <div>
            <CssBaseline />
            <Header />
            <LeftSidebar>
                <Table>
                    <TableBody>
                    {[ ...Array(100)].map((val) => Math.floor(Math.random() * 6)).map((val, index) => (
                        <TableRow key={index}>
                            <TableCell style={{ backgroundColor: [ red, yellow, lightGreen, purple, lightBlue, grey ][2][400] }}></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </LeftSidebar>
            <Content />
            <RightSidebar>
                <div style={{ margin: 8 }}>
                    {[ ...Array(100)].map(() => <p>Testing</p>)}
                </div>
            </RightSidebar>
        </div>
    )
    /*return (
        <div 
            style={{
                width: "50%"
            }}
        >
            <Paper>
                <Button onClick={loadProject}>
                    Load project
                </Button>
                <Button onClick={runTests}>
                    Run Tests
                </Button>
                {filename}
            </Paper>
            {(executionState === ExecutionState.Running || 
              executionState === ExecutionState.Finished) && <Paper>
                {Object.entries(tests).map(([ index, val ]) => (
                    <ProgramTestComponent
                        testName={index}
                        state={val.state}
                        stdin={val.stdin}
                        stdout={val.stdout}
                        executionTime={val.executionTime}
                        error={val.error}
                        killTest={killTest}
                        key={index} 
                    />
                ))}
            </Paper>}
            {(executionState === ExecutionState.Compiling) && <Paper>Compiling...</Paper>}
        </div>
    )*/
}

export default App