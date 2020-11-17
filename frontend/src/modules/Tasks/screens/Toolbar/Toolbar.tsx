import { Button, useTheme } from '@material-ui/core';
import React from 'react';
import { TaskState } from 'reduxState/models';
import useStyles from './Toolbar.css';
import { ToolbarPropsModel, ToolbarStateModel } from './Toolbar.d';

export const Toolbar: React.FunctionComponent<ToolbarPropsModel> = ({ setSearch }) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <>
            <div className={classes.Toolbar}>
                {[
                    TaskState.Successful,
                    TaskState.WrongAnswer,
                    TaskState.Timeout,
                    TaskState.Crashed,
                    TaskState.Pending,
                    TaskState.Running,
                    TaskState.Killed,
                ].map((state) => (
                    <Button
                        style={{
                            backgroundColor: theme.palette.taskState[state],
                            color: theme.palette.getContrastText(theme.palette.taskState[state]),
                            marginRight: 10,
                        }}
                        onClick={() => setSearch(`${state}`)}
                    >
                        {TaskState[state]}
                    </Button>
                ))}
                <Button
                    style={{
                        marginRight: 10,
                    }}
                    onClick={() => setSearch('-1')}
                >
                    No filter
                </Button>
            </div>
        </>
    );
};

export default Toolbar;
