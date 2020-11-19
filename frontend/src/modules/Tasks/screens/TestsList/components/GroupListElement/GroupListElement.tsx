import React from 'react';
import useStyles from './GroupListElement.css';
import { GroupListElementPropsModel, GroupListElementStateModel } from './GroupListElement.d';
import { Button, useTheme } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon, PlayArrow } from '@material-ui/icons';
import { ExecutionState, TaskState } from 'reduxState/models';
import { ButtonWithTooltip } from 'components';
import { useRunTasks } from 'backend/main';
import { useExecutionState } from 'reduxState/selectors';

export const GroupListElement: React.FunctionComponent<GroupListElementPropsModel> = ({
    isExpanded,
    clickExpandGroupButton,
    groupObject,
}) => {
    const classes = useStyles();
    const theme = useTheme();

    const runTask = useRunTasks();
    const executionState = useExecutionState();

    return (
        <>
            <div className={classes.GroupListElement}>
                <div className={classes.groupName}>{groupObject.name}</div>
                <div className={classes.groupTestsAmountLabel}>
                    (<span>{groupObject.allTestsAmount}</span>
                    {[TaskState.Successful, TaskState.WrongAnswer, TaskState.Timeout, TaskState.Crashed].map((state) => (
                        <span key={state} style={{ color: theme.palette.taskState[state] }}>
                            {' '}
                            {groupObject.testsAmounts[state]}
                        </span>
                    ))}
                    )
                </div>
                <div className={classes.buttons}>
                    <ButtonWithTooltip
                        tooltipText="Run group"
                        placement="bottom"
                        arrow
                        onClick={() => runTask({ groups: [groupObject.id] })}
                        classes={{ root: classes.Button }}
                        disabled={[ExecutionState.Compiling, ExecutionState.Running].includes(executionState.state)}
                    >
                        <PlayArrow fontSize="small" />
                    </ButtonWithTooltip>
                    <Button onClick={clickExpandGroupButton} classes={{ root: classes.Button }}>
                        {isExpanded ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default GroupListElement;
