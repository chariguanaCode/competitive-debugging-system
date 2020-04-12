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
    testId: string
    taskState: Task
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
    ({ testId, taskState }: SingleTestProps): ReactElement => {
        return (
            <TableRow>
                <TableCell
                    style={{
                        backgroundColor: colors[taskState.state as number],
                    }}
                ></TableCell>
            </TableRow>
        )
    }
)

export default function TestProgress(): ReactElement {
    const { taskStates, shouldTasksReload } = useContext(GlobalStateContext)
    console.log(shouldTasksReload, taskStates.current)

    return useMemo(
        () => (
            <Table>
                <TableBody>
                    {Object.entries(taskStates.current).map(([id, val]) => (
                        <SingleTest key={id} testId={id} taskState={val} />
                    ))}
                </TableBody>
            </Table>
        ),
        [taskStates, shouldTasksReload]
    )
}
