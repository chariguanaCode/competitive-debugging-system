import React, { ReactElement, useEffect } from 'react';
import { useAllTasksState, useCurrentTaskState, useConfig } from 'reduxState/selectors';
import { TaskState } from 'reduxState/models';
import { useTaskStatesActions } from 'reduxState/actions';
import { readFileStream } from 'backend/outputFileTracking';
import { clearWatchblocks, readWatchblocks, parseWatchblocks } from 'backend/watchParse';

export default function Daemons(): ReactElement {
    const taskStates = useAllTasksState();
    const currentTask = useCurrentTaskState();
    const config = useConfig();

    const currentTaskProgress = taskStates.current[currentTask.id]?.state;

    const {
        setCurrentTaskStdout,
        setCurrentTaskStdoutSize,
        setCurrentTaskWatchblocks,
        setCurrentTaskWatchblocksSize,
    } = useTaskStatesActions();

    useEffect(() => {
        if (![TaskState.Pending, TaskState.Running, undefined].includes(currentTaskProgress)) {
            console.log(currentTask.id, currentTaskProgress);
            readFileStream(
                config.tasks[currentTask.id].filePath + '.out',
                false,
                (data: Uint8Array) => setCurrentTaskStdout(new TextDecoder('utf-8').decode(data)),
                setCurrentTaskStdoutSize,
                () => {},
                () => {}
            );

            readFileStream(
                config.tasks[currentTask.id].filePath + '.err',
                true,
                (data: Uint8Array) => parseWatchblocks(data),
                setCurrentTaskWatchblocksSize,
                () => clearWatchblocks(),
                () => {
                    setCurrentTaskWatchblocks(readWatchblocks());
                }
            );
        }
    }, [
        currentTask.id,
        currentTaskProgress,
        setCurrentTaskStdout,
        setCurrentTaskStdoutSize,
        setCurrentTaskWatchblocks,
        setCurrentTaskWatchblocksSize,
    ]);

    return <></>;
}
