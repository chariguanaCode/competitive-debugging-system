import React, { useState } from 'react';
import useStyles from './TasksAddition.css';
import { TasksAdditionPropsModel, TasksAdditionStateModel } from './TasksAddition.d';
import { AdditionForm } from './components';
export const TasksAddition: React.FunctionComponent<TasksAdditionPropsModel> = ({}) => {
    const classes = useStyles();
    const [inputsPaths, setInputsPaths] = useState<Array<string>>([]);
    return (
        <>
            <div className={classes.TasksAddition}>
                <AdditionForm title={'SELECT OUTPUTS'} />
            </div>
        </>
    );
};

export default TasksAddition;
