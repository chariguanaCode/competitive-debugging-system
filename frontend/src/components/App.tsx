import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Paper from './Paper'
import Fade from '@material-ui/core/Fade'
import ProgramTestComponent from './ProgramTest'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
    CssBaseline,
    createMuiTheme,
    Switch,
    FormControlLabel,
} from '@material-ui/core'
import Header from './Header'
import Content from './Content'
import Sidebar from './Sidebar'
import {
    amber,
    yellow,
    orange,
    lightGreen,
    grey,
    green,
    teal,
    cyan,
    purple,
    blue,
    deepOrange,
    indigo,
} from '@material-ui/core/colors'
import { ThemeProvider } from '@material-ui/core/styles'
import TestProgress from './TestProgress'
import { Interface } from 'readline'
import { connect } from 'react-redux'
import { changeLanguage } from '../redux/actions'
enum ExecutionState {
    NoProject,
    Compiling,
    CompilationError,
    Running,
    Finished,
}

interface ConnectionErrorProps {}

export const ConnectionError: React.FunctionComponent<ConnectionErrorProps> = () => {
    /* let connectionTimeout = Math.min(4000, 2 * connectionTimeout.current) 

    console.log(
        `Socket is closed. Reconnect will be attempted in ${connectionTimeout.current / 1000} second.`,
        e.reason
    )*/

    return (
        <Fade
            in={true}
            style={{
                transitionDelay: '500ms',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 10000,
                    position: 'absolute',
                    backgroundColor: 'rgba(22, 22, 22, 0.5)',
                }}
            >
                <div
                    style={{
                        zIndex: 10001,
                        position: 'absolute',
                        left: 'calc(50% - 60px)',
                        top: 'calc(50% - 30px)',
                        width: '140px',
                        height: '60px',
                        backgroundColor: 'rgba(255, 77, 77, 0.5)',
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            top: 'calc(50% - 26px)',
                            margin: '10px',
                        }}
                    >
                        Loading
                    </span>
                    <CircularProgress
                        style={{
                            position: 'absolute',
                            left: '70px',
                            margin: '10px',
                        }}
                    />
                </div>
            </div>
        </Fade>
    )
}

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: amber,
        watchblocks: {
            //do ogarniecia bo srednio wyglada
            line: orange[500],
            name: blue[600],
            data_type: grey[600],

            array: cyan[600],
            pair: purple[500],
            struct: teal[700],
            watchblock: teal[700],

            string: green[500],
            bitset: deepOrange[500],
            number: indigo[500],
            pointer: '#FF80FF',
        },
    },
})

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: amber,
        watchblocks: {
            line: yellow[600],
            name: lightGreen['A400'],
            data_type: grey[500],

            array: cyan[600],
            pair: purple['A100'],
            struct: teal[700],
            watchblock: teal[500],

            string: green[700],
            bitset: teal['A400'],
            number: cyan['A400'],
            pointer: '#FF80FF',
        },
    },
})

const mapStateToProps = (state: any) => {
    return { language: state.language }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        changeLanguge: (language: string) => dispatch(changeLanguage(language)),
    }
}

interface sr {
    language?: string
    changeLanguage?: Function
}

const App: React.FC<sr> = ({ language, changeLanguage }) => {
    const [filename, setFilename] = useState('')
    const [executionState, setExecutionState] = useState<ExecutionState>(
        ExecutionState.NoProject
    )
    const [socket, setSocket] = useState()
    //const [ filePath, setFilePath ] = useState("/home/charodziej/Documents/OIG/OI27/nww.cpp")
    const [filePath, setFilePath] = useState(
        '/home/charodziej/Documents/competitive-debugging-system/cpp/test.cpp'
    )
    const [theme, setTheme] = useState(darkTheme)
    const connectionTimeout = useRef(250)
    const lastServerPing = useRef(0)
    const isServerConnected = useRef(false)

    const check = () => {
        if (!socket || socket.readyState === WebSocket.CLOSED) connect()
    }

    const connect = () => {
        var ws = new WebSocket('ws://localhost:8000')
        var connectInterval: number ///inaczej nie działa

        ws.onopen = () => {
            console.log('connected websocket main component')
            isServerConnected.current = true
            setSocket(ws)
            connectionTimeout.current = 250
            clearTimeout(connectInterval)
        }
        /*setInterval(()=>{
            if(isServerConnected.current && Date.now() - lastServerPing.current > 2000){
                console.error("xd");
                //@ts-ignore
                if(isServerConnected.current) ws.onclose({reason: "idk"});
                isServerConnected.current = false;
            }
        },2000)*/
        ws.onclose = (e) => {
            // isServerConnected.current = false;
            setSocket(null)
            connectionTimeout.current = Math.min(
                4000,
                2 * connectionTimeout.current
            )

            console.log(
                `Socket is closed. Reconnect will be attempted in ${connectionTimeout.current /
                    1000} second.`,
                e.reason
            )

            connectInterval = setTimeout(check, connectionTimeout.current)
        }

        ws.onerror = (err) => {
            console.error('Socket encountered an error. Closing the socket.')

            ws.close()
        }

        ws.onmessage = (msg) => {
            const message = JSON.parse(msg.data)
            const type = message.type
            const data = message.data
            //console.log(message)
            if (type === 'serverPING') {
                lastServerPing.current = Date.now()
            } else if (type === 'newConfig') {
                setFilename(data.filename)
                //setTests(data.tests)
            } else if (type === 'compilationBegin') {
                setExecutionState(ExecutionState.Compiling)
            } else if (type === 'compilationSuccess') {
                setExecutionState(ExecutionState.Running)
            } else if (type === 'compilationError') {
                setExecutionState(ExecutionState.CompilationError)
            }
        }
    }

    useEffect(() => {
        connect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadProject = () => {
        socket.send(
            JSON.stringify({
                type: 'loadProject',
                filename: filePath,
            })
        )
    }

    const runTests = () => {
        socket.send(
            JSON.stringify({
                type: 'runTasks',
            })
        )
    }

    const killTest = (testName: string) => {
        socket.send(
            JSON.stringify({
                type: 'killTest',
            })
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <>
                {!socket && <ConnectionError />}
                <div
                    style={
                        socket
                            ? {
                                  width: '100vw',
                                  height: '100vh',
                              }
                            : { pointerEvents: 'none' }
                    }
                >
                    <CssBaseline />
                    <Header
                        socket={socket}
                        filePath={filePath}
                        loadProject={loadProject}
                        runTests={runTests}
                    />
                    <Sidebar variant="left">
                        <TestProgress socket={socket} />
                    </Sidebar>
                    {/*
                //@ts-ignore    }
            <button onClick = {()=>{changeLanguage("pl")}}>LOL</button>
            {/*<Content />*/}
                    <Content socket={socket} />

                    <Sidebar variant="right">
                        <div style={{ margin: 8 }}>
                            <FormControlLabel
                                label="Dark mode"
                                control={
                                    <Switch
                                        checked={theme.palette.type === 'dark'}
                                        onChange={(evt) =>
                                            setTheme(
                                                evt.target.checked
                                                    ? darkTheme
                                                    : lightTheme
                                            )
                                        }
                                    />
                                }
                            />
                            {[...Array(100)].map((val, index) => (
                                <p key={index}>Testing</p>
                            ))}
                        </div>
                    </Sidebar>
                </div>
            </>
        </ThemeProvider>
    )
    /*return (
        <div 
        
           
        >
            <TestManager socket = {socket}/>
            
            {/*<Paper>
                
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
                {(executionState === ExecutionState.Compiling) && <Paper>Compiling...</Paper>}*/
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
