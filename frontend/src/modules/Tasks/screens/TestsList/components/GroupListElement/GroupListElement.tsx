import React from 'react';
import useStyles from './GroupListElement.css';
import { GroupListElementPropsModel, GroupListElementStateModel } from './GroupListElement.d';
import { Button, useTheme } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon, PlayArrow } from '@material-ui/icons';
import { ExecutionState, TaskState } from 'reduxState/models';
import { ButtonWithTooltip } from 'components';
import { useRunTests } from 'backend/main';
import { useExecutionState, useConfig } from 'reduxState/selectors';
import { ConfigActions } from 'reduxState/actions';

export const GroupListElement: React.FunctionComponent<GroupListElementPropsModel> = ({
    isExpanded,
    clickExpandGroupButton,
    groupObject,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const runTests = useRunTests();
    const config = useConfig();
    const executionState = useExecutionState();

    return (
        <>
            <div className={classes.GroupListElement}>
                <div className={classes.groupName}>{groupObject.name}</div>
                <div className={classes.groupTestsAmountLabel}>
                    (<span>{groupObject.allTestsAmount}</span>
                    {[TaskState.Successful, TaskState.OK, TaskState.WrongAnswer, TaskState.Timeout, TaskState.Crashed].map((state) => (
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
                        onClick={() => runTests({ [groupObject.id]: Object.keys(config.tests.groups[groupObject.id].tests) })}
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
