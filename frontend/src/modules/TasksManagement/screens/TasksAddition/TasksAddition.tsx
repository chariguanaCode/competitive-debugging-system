import React, { useState } from 'react';
import useStyles from './TasksAddition.css';
import { TasksAdditionPropsModel, TasksAdditionStateModel } from './TasksAddition.d';
import { AdditionForm } from './components';
import { useFileManagerActions } from 'reduxState/actions';
export const TasksAddition: React.FunctionComponent<TasksAdditionPropsModel> = ({}) => {
    const classes = useStyles();
    const [inputsPaths, setInputsPaths] = useState<Array<string>>([]);
    const { setFileManager } = useFileManagerActions();
    console.log(inputsPaths)
    return (
        <>
            <div className={classes.TasksAddition}>
                <AdditionForm
                    setFileManager={setFileManager}
                    title={'SELECT OUTPUTS'}
                    selectedFiles={inputsPaths}
                    setSelectedFiles={setInputsPaths}
                />
            </div>
        </>
    );
};

export default TasksAddition;
