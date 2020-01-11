import React, { ReactElement, useEffect, useState, useRef } from 'react'
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { grey, red, yellow, lightGreen, lightBlue, purple, } from '@material-ui/core/colors';

interface SingleTestProps {
    testId: string,
    testData: TestData,
}

const colors = [ "white", lightBlue[400], lightGreen[400], yellow[400], red[400], purple[400], grey[400] ]

const SingleTest = React.memo(({ testId, testData }: SingleTestProps): ReactElement => {
    return (
        <TableRow>
            <TableCell 
                style={{ 
                    backgroundColor: colors[testData.state as number] 
                }}
            >

            </TableCell>
        </TableRow>
    )
})

enum TestState {
    Pending,
    Running,
    Successful,
    Timeout,
    WrongAnswer,
    Crashed,
    Killed,
}

interface TestData {
    state: TestState,
    stdout: string,
    stdin: string,
    error: any,
    executionTime: string,
}

interface ProgramTestData {
    [testName: string]: TestData
}

interface Props {
    socket: WebSocket,
}

export default function TestProgress({ socket }: Props): ReactElement {
    const [ messageCount, updateMessageCount ] = useState(0)
    const tests = useRef<ProgramTestData>({ })

    const processMessage = (msg: any) => {
        const message = JSON.parse(msg.data)
        const { type, data } = message

        if (type !== "serverPING") console.log("Message:", message)
        if (type === "newConfig") {
            tests.current = data.tests
            updateMessageCount((prev) => prev + 1)
        } else if (type === "testOverviewUpdate") {
            for (const testChange of data) {
                let state: TestState;
                switch(testChange.state) {
                    case "pending":     state = TestState.Pending;     break;
                    case "running":     state = TestState.Running;     break;
                    case "success":     state = TestState.Successful;  break;
                    case "timeout":     state = TestState.Timeout;     break;
                    case "wrongAnswer": state = TestState.WrongAnswer; break;
                    case "crashed":     state = TestState.Crashed;     break;
                    case "killed":      state = TestState.Killed;      break;
                    default:            state = TestState.Pending;     break;
                }

                tests.current[testChange.id] = {
                    state,
                    stdin: testChange.stdin,
                    stdout: testChange.stdout,
                    executionTime: testChange.executionTime,
                    error: testChange.error
                }
            }
            updateMessageCount((prev) => prev + 1)
        }
    }

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", processMessage)
        }
        return () => {
            if (socket) {
                socket.removeEventListener("message", processMessage)
            }
        }
    }, [socket])

    return (
        <Table>
            <TableBody>
            {Object.entries(tests.current).map(([ id, val ]) => (
                <SingleTest 
                    key={id} 
                    testId={id}
                    testData={val}
                />
            ))}
            </TableBody>
        </Table>
    )
}
