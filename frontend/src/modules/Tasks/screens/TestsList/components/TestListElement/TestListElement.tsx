import React, { memo } from 'react';
import useStyles from './TestListElement.css';
import { Button, Tooltip, useTheme } from '@material-ui/core';
import { TestListElementPropsModel, TestListElementStateModel } from './TestListElement.d';
import { Assessment, BugReport, Close } from '@material-ui/icons';
import { TaskState } from 'reduxState/models';
import { useConfigActions, useTaskStatesActions } from 'reduxState/actions';
import { useCurrentTaskState } from 'reduxState/selectors';

export const TestListElement: React.FunctionComponent<TestListElementPropsModel> = ({ testObject, groupId }) => {
    const classes = useStyles();
    const theme = useTheme();

    const { selectLayout } = useConfigActions();
    const { setCurrentTaskId } = useTaskStatesActions();
    const currentTest = useCurrentTaskState();

    const debugTest = (id: string) => {
        if (currentTest.id !== id) setCurrentTaskId({ id, groupId });
        selectLayout('debugging');
    };

    const viewTestOutput = (id: string) => {
        if (currentTest.id !== id) setCurrentTaskId({ id, groupId });
        selectLayout('outputs');
    };

    return (
        <>
            <div className={classes.TestListElement}>
                <Tooltip title={TaskState[testObject.state]} placement="right" arrow>
                    <div
                        className={classes.status}
                        style={{
                            backgroundColor: theme.palette.taskState[testObject.state],
                        }}
                    />
                </Tooltip>
                <div className={classes.testName}>{testObject.name}</div>
                <div className={classes.executionTime}>{testObject.executionTime}</div>
                <div className={classes.buttons}>
                    {testObject.state === TaskState.Running && (
                        <Tooltip title="Kill" placement="bottom" arrow>
                            <Button onClick={() => {}} classes={{ root: classes.Button }}>
                                <Close fontSize="small" />
                            </Button>
                        </Tooltip>
                    )}
                    {testObject.state !== TaskState.Pending && testObject.state !== TaskState.Running && (
                        <>
                            <Tooltip title="View output" placement="bottom" arrow>
                                <Button onClick={() => viewTestOutput(testObject.id)} classes={{ root: classes.Button }}>
                                    <Assessment fontSize="small" />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Debug" placement="bottom" arrow>
                                <Button onClick={() => debugTest(testObject.id)} classes={{ root: classes.Button }}>
                                    <BugReport fontSize="small" />
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default memo(TestListElement);
