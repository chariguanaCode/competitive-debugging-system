import React, { ReactElement } from 'react';
import GlobalStateContext, { Task } from '../utils/GlobalStateContext';
import { useContextSelector } from 'use-context-selector';
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import {
    grey,
    red,
    yellow,
    lightGreen,
    lightBlue,
    purple,
} from '@material-ui/core/colors';

interface SingleTestProps {
    taskId: string;
    taskState: Task;
    onClick: () => void;
}

const colors = [
    'white',
    lightBlue[400],
    lightGreen[400],
    yellow[400],
    red[400],
    purple[400],
    grey[400],
];

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
        );
    }
);

export default function TestProgress(): ReactElement {
    const taskStates = useContextSelector(
        GlobalStateContext,
        (v) => v.taskStates
    );
    const shouldTasksReload = useContextSelector(
        GlobalStateContext,
        (v) => v.shouldTasksReload
    );
    const setCurrentTaskId = useContextSelector(
        GlobalStateContext,
        (v) => v.setCurrentTaskId
    );

    return (
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
    );
}
