import React from 'react';
import useStyles from './GroupListElement.css';
import { GroupListElementPropsModel, GroupListElementStateModel } from './GroupListElement.d';
import { Button, useTheme } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon } from '@material-ui/icons';
import { TaskState } from 'reduxState/models';

export const GroupListElement: React.FunctionComponent<GroupListElementPropsModel> = ({
    isExpanded,
    clickExpandGroupButton,
    groupObject,
}) => {
    const classes = useStyles();
    const theme = useTheme();

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
                    <Button onClick={clickExpandGroupButton} classes={{ root: classes.Button }}>
                        {isExpanded ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default GroupListElement;
