import React, { ReactElement, useMemo, useContext } from 'react'
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import {
    grey,
    red,
    yellow,
    lightGreen,
    lightBlue,
    purple,
} from '@material-ui/core/colors'
import GlobalStateContext, { Task } from '../utils/GlobalStateContext'

interface SingleTestProps {
    taskId: string
    taskState: Task
    onClick: () => void
}

const colors = [
    'white',
    lightBlue[400],
    lightGreen[400],
    yellow[400],
    red[400],
    purple[400],
    grey[400],
]

const SingleTest = React.memo(
    ({ taskId, taskState, onClick }: SingleTestProps): ReactElement => {
        return (
            <TableRow>
                <TableCell
                    style={{
                        backgroundColor: colors[taskState.state as number],
                        paddingTop: 2,
                        paddingBottom: 2,
                    }}
                    onClick={onClick}
                >
                    {taskId}
                </TableCell>
            </TableRow>
        )
    }
)

export default function TestProgress(): ReactElement {
    const { taskStates, shouldTasksReload, setCurrentTaskId } = useContext(
        GlobalStateContext
    )

    return useMemo(
        () => (
            <Table>
                <TableBody>
                    {Object.entries(taskStates.current).map(([id, val]) => (
                        <SingleTest
                            key={id}
                            taskId={id}
                            taskState={val}
                            onClick={() => setCurrentTaskId(id)}
                        />
                    ))}
                </TableBody>
            </Table>
        ),
        [taskStates, shouldTasksReload, setCurrentTaskId]
    )
}
