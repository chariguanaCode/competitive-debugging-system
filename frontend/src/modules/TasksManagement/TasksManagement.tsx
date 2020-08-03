import React, { useState } from 'react';
import useStyles from './TasksManagement.css';
import { TasksMerge, TasksAddition } from './screens';
import { TasksManagementPropsModel, TasksManagementStateModel } from './TasksManagement.d';

export const TasksManagement: React.FunctionComponent<TasksManagementPropsModel> = ({}) => {
    const classes = useStyles();
    const [state, _setState] = useState<TasksManagementStateModel>({ inputPaths: [], outputPaths: [] });
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
                    inputsPaths={state.inputPaths}
                    outputsPaths={state.outputPaths}
                    setInputsPaths={(newPaths: Array<string>) => {
                        setState('inputPaths', newPaths);
                    }}
                    setOutputsPaths={(newPaths: Array<string>) => {
                        setState('outputPaths', newPaths);
                    }}
                />
                <TasksMerge inputsPaths={state.inputPaths} outputsPaths={state.outputPaths} />
            </div>
        </>
    );
};

export default TasksManagement;
