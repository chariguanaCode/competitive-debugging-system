import React, { useState } from 'react';
import useStyles from './TasksManagement.css';
import { TasksMerge, TasksAddition } from './screens';
import { TasksManagementPropsModel, TasksManagementStateModel } from './TasksManagement.d';

export const TasksManagement: React.FunctionComponent<TasksManagementPropsModel> = ({}) => {
    const classes = useStyles();
    const [state, _setState] = useState<TasksManagementStateModel>({ inputsFiles: [], outputsFiles: [] });
    const setState = (type: string, value: any | ((arg1: any) => any)) => {
        _setState((pvState: any) => ({
            ...pvState,
            [type]: typeof value === 'function' ? value(pvState[type]) : value,
        }));
    };
    return (
        <>
            <div className={classes.TasksManagement}>
                <TasksAddition
                    inputsFiles={state.inputsFiles}
                    outputsFiles={state.outputsFiles}
                    setInputsPaths={(newPaths: Array<string>) => {
                        setState('inputsFiles', newPaths);
                    }}
                    setOutputsPaths={(newPaths: Array<string>) => {
                        setState('outputsFiles', newPaths);
                    }}
                />
                <TasksMerge showLists={false} inputsFiles={state.inputsFiles} outputsFiles={state.outputsFiles} />
            </div>
        </>
    );
};

export default TasksManagement;
