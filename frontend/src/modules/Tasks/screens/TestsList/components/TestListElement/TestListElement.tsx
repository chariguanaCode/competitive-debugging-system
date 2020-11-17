import React from 'react';
import useStyles from './TestListElement.css';
import { Button, Tooltip, useTheme } from '@material-ui/core';
import { TestListElementPropsModel, TestListElementStateModel } from './TestListElement.d';
import { Edit as EditIcon, Delete as DeleteIcon, Assessment, BugReport, Close } from '@material-ui/icons';
import { TaskState } from 'reduxState/models';

export const TestListElement: React.FunctionComponent<TestListElementPropsModel> = ({ testObject }) => {
    const classes = useStyles();
    const theme = useTheme();

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
                                <Button onClick={() => {}} classes={{ root: classes.Button }}>
                                    <Assessment fontSize="small" />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Debug" placement="bottom" arrow>
                                <Button onClick={() => {}} classes={{ root: classes.Button }}>
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

export default TestListElement;
