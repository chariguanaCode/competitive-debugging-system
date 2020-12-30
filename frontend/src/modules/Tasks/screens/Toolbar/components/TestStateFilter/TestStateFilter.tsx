import React, { memo, useRef, useState } from 'react';
import useStyles from './TestStateFilter.css';
import { TestStateFilterPropsModel, TestStateFilterStateModel } from './TestStateFilter.d';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    Paper,
    TextField,
    Tooltip,
    useTheme,
} from '@material-ui/core';
import { ArrowDropDown, NewReleasesTwoTone } from '@material-ui/icons';
import clsx from 'clsx';
import { AnchoredDialog } from 'components';
import { TaskState } from 'reduxState/models';

export const TestStateFilter: React.FunctionComponent<TestStateFilterPropsModel> = ({ filter, setFilter }) => {
    const classes = useStyles();
    const theme = useTheme();

    const [dialogOpen, setDialogOpen] = useState(false);

    const setSingleFilter = (id: TaskState, value: boolean) => {
        setFilter((oldSet) => {
            const newSet = new Set(oldSet);
            if (value) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    };

    const testStateOrder = [
        TaskState.Successful,
        TaskState.OK,
        TaskState.WrongAnswer,
        TaskState.Timeout,
        TaskState.Crashed,
        TaskState.Pending,
        TaskState.Running,
        TaskState.Killed,
    ];

    const testStateSelectRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <FormControl>
                <InputLabel shrink={filter.size > 0} className={dialogOpen ? 'Mui-focused' : undefined}>
                    Task State
                </InputLabel>
                <Input
                    onClick={() => setDialogOpen(true)}
                    readOnly
                    className={dialogOpen ? 'Mui-focused' : undefined}
                    inputComponent={({ className }) => (
                        <div className={clsx(className, classes.selectWrapper)} ref={testStateSelectRef}>
                            {testStateOrder
                                .filter((value) => filter.has(value))
                                .map((value) => (
                                    <Tooltip key={value} arrow placement={'bottom'} title={TaskState[value]}>
                                        <div
                                            className={classes.selectElement}
                                            style={{
                                                backgroundColor: theme.palette.taskState[value],
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            <Button className={clsx(classes.selectArrow)} classes={{ root: classes.Button }}>
                                <ArrowDropDown />
                            </Button>
                        </div>
                    )}
                />
            </FormControl>
            <AnchoredDialog
                open={dialogOpen}
                anchorElRef={testStateSelectRef}
                closeOnClickOutside
                closeDialog={() => setDialogOpen(false)}
                position="middle-bottom"
                anchorPosition="middle-top"
                content={
                    <Paper style={{ padding: 8, display: 'flex', flexDirection: 'column' }}>
                        {testStateOrder.map((value) => (
                            <FormControlLabel
                                key={value}
                                className={classes.checkBoxLabel}
                                control={
                                    <Checkbox
                                        checked={filter.has(value)}
                                        onChange={(event) => setSingleFilter(value, event.target.checked)}
                                        style={{ color: theme.palette.taskState[value] }}
                                    />
                                }
                                label={TaskState[value]}
                            />
                        ))}
                    </Paper>
                }
            />
        </>
    );
};

export default TestStateFilter;
