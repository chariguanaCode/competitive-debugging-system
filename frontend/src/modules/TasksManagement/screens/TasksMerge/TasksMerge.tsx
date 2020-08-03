import React from 'react';
import useStyles from './TasksMerge.css';
import { TasksMergePropsModel, TasksMergeStateModel } from './TasksMerge.d';
import { PathsList } from 'modules/TasksManagement/components';

export const TasksMerge: React.FunctionComponent<TasksMergePropsModel> = ({ inputsPaths, outputsPaths }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.TasksMerge}>
              
            </div>
        </>
    );
};

export default TasksMerge;
