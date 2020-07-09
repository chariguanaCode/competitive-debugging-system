import React from 'react';

import GlobalStateContext, { Task, TaskState } from '../utils/GlobalStateContext';
import { useContextSelector } from 'use-context-selector';
import { makeStyles, useTheme, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: 32,
        height: 'calc(100vh - 64px - 24px)',
        position: 'absolute',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.drawer,
        boxShadow: theme.shadows[4],
    },
    taskStateSegment: {
        transition: theme.transitions.create(['flex-grow', 'flex-basis', 'width']),
        flexBasis: 16,
        width: 32,
        '&:hover': {
            flexBasis: 24,
            width: 40,
        },
    },
}));

const SideProgressbar = () => {
    const classes = useStyles();
    const theme = useTheme();

    const shouldTasksReload = useContextSelector(GlobalStateContext, (v) => v.shouldTasksReload);
    const taskStates = useContextSelector(GlobalStateContext, (v) => v.taskStates).current;
    const states = Object.values(taskStates).map((task: Task) => task.state);

    const stateOverview = {
        [TaskState.Pending]: 0,
        [TaskState.Running]: 0,
        [TaskState.Successful]: 0,
        [TaskState.Timeout]: 0,
        [TaskState.WrongAnswer]: 0,
        [TaskState.Crashed]: 0,
        [TaskState.Killed]: 0,
    } as { [key in TaskState]: number };

    for (let i = 0; i < states.length; i++) {
        stateOverview[states[i]]++;
    }

    return (
        <div className={classes.wrapper}>
            {[
                TaskState.Successful,
                TaskState.Timeout,
                TaskState.WrongAnswer,
                TaskState.Crashed,
                TaskState.Killed,
                TaskState.Running,
                TaskState.Pending,
            ].map((key) => (
                <Tooltip
                    title={
                        <>
                            {TaskState[key]}
                            <br />
                            {((100 * stateOverview[key]) / states.length).toFixed(1)}%
                            <br />
                            {stateOverview[key]}/{states.length}
                        </>
                    }
                    placement="right"
                    arrow
                >
                    <div
                        className={classes.taskStateSegment}
                        style={{
                            flexBasis: stateOverview[key] === 0 ? '0px' : undefined,
                            flexGrow: stateOverview[key],
                            backgroundColor: theme.palette.taskState[key],
                        }}
                    />
                </Tooltip>
            ))}
        </div>
    );
};

export default SideProgressbar;
