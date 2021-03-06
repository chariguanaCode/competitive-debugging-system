import React, { memo } from 'react';
import useStyles from './TestListElement.css';
import { Button, Tooltip, useTheme } from '@material-ui/core';
import { TestListElementPropsModel, TestListElementStateModel } from './TestListElement.d';
import {
    Assessment as AssessmentIcon,
    BugReport as BugReportIcon,
    Close as CloseIcon,
    PlayArrow as PlayArrowIcon,
} from '@material-ui/icons';
import { ExecutionState, TaskState } from 'reduxState/models';
import { useConfigActions, useTaskStatesActions } from 'reduxState/actions';
import { useCurrentTaskState, useExecutionState } from 'reduxState/selectors';
import { useRunTests } from 'backend/main';
import { ButtonWithTooltip } from 'components';

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

    const runTests = useRunTests();
    const executionState = useExecutionState();

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
                        <ButtonWithTooltip
                            tooltipText="Kill"
                            placement="bottom"
                            arrow
                            onClick={() => {}}
                            classes={{ root: classes.Button }}
                        >
                            <CloseIcon fontSize="small" />
                        </ButtonWithTooltip>
                    )}
                    {testObject.state !== TaskState.Running && (
                        <ButtonWithTooltip
                            tooltipText="Run"
                            placement="bottom"
                            arrow
                            onClick={() => runTests({ [groupId]: [testObject.id] })}
                            classes={{ root: classes.Button }}
                            disabled={[ExecutionState.Compiling, ExecutionState.Running].includes(executionState.state)}
                        >
                            <PlayArrowIcon fontSize="small" />
                        </ButtonWithTooltip>
                    )}
                    {testObject.state !== TaskState.Pending && testObject.state !== TaskState.Running && (
                        <>
                            <ButtonWithTooltip
                                tooltipText="View output"
                                placement="bottom"
                                arrow
                                onClick={() => viewTestOutput(testObject.id)}
                                classes={{ root: classes.Button }}
                            >
                                <AssessmentIcon fontSize="small" />
                            </ButtonWithTooltip>
                            <ButtonWithTooltip
                                tooltipText="Debug"
                                placement="bottom"
                                arrow
                                onClick={() => debugTest(testObject.id)}
                                classes={{ root: classes.Button }}
                            >
                                <BugReportIcon fontSize="small" />
                            </ButtonWithTooltip>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default memo(TestListElement);
