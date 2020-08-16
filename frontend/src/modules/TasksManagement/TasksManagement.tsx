import React, { useState, useEffect } from 'react';
import useStyles from './TasksManagement.css';
import { TasksAddition } from './screens';
import { TasksManagementPropsModel, TasksManagementStateModel } from './TasksManagement.d';
import { Button, Dialog } from '@material-ui/core';
import { useFileManagerActions } from 'reduxState/actions';
export const TasksManagement: React.FunctionComponent<TasksManagementPropsModel> = ({}) => {
    const classes = useStyles();
    const [state, setState] = useState<TasksManagementStateModel>({
        tasksAdditionDialogVisibility: false,
    });
    /*const { setFileManager } = useFileManagerActions();
    useEffect(() => {
        setFileManager({
            open: true,
        });
    }, []);*/ /* FOR DEBUG REASONS */
    return (
        <>
            <div className={classes.TasksManagement}>
                <Dialog
                    maxWidth={'xl'}
                    open={state.tasksAdditionDialogVisibility}
                    onClose={() => {
                        setState({ tasksAdditionDialogVisibility: false });
                    }}
                >
                    <TasksAddition />
                </Dialog>
                <Button onClick={() => setState({ tasksAdditionDialogVisibility: true })}> Add tasks </Button>
            </div>
        </>
    );
};

export default TasksManagement;
