import React, { useState } from 'react';
import useStyles from './TasksAddition.css';
import { TasksAdditionPropsModel, TasksAdditionStateModel } from './TasksAddition.d';
import { AdditionForm } from './components';
import { useFileManagerActions } from 'reduxState/actions';
export const TasksAddition: React.FunctionComponent<TasksAdditionPropsModel> = ({
    inputsFiles,
    setInputsPaths,
    outputsFiles,
    setOutputsPaths,
}) => {
    const classes = useStyles();
    const { setFileManager } = useFileManagerActions();
    return (
        <>
            <div className={classes.TasksAddition}>
                <div className={classes.additionFormContainers}>
                    <div className={classes.additionFormContainer}>
                        <AdditionForm
                            setFileManager={setFileManager}
                            title={'SELECT INPUTS'}
                            selectedFiles={inputsFiles}
                            setSelectedFiles={setInputsPaths}
                        />
                    </div>
                    <div className={classes.additionFormContainer}>
                        <AdditionForm
                            setFileManager={setFileManager}
                            title={'SELECT OUTPUTS'}
                            selectedFiles={outputsFiles}
                            setSelectedFiles={setOutputsPaths}
                            mirrored={true}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TasksAddition;
