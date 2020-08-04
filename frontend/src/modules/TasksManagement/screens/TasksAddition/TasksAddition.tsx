import React, { useState } from 'react';
import useStyles from './TasksAddition.css';
import { TasksAdditionPropsModel, TasksAdditionStateModel, MergedFilesModel } from './TasksAddition.d';
import { AdditionForm, MergedFilesTable, MergeFilesForm } from './components';
import { useFileManagerActions } from 'reduxState/actions';
import { Button } from '@material-ui/core';
import { useConfigActions } from 'reduxState/actions';

export const TasksAddition: React.FunctionComponent<TasksAdditionPropsModel> = ({}) => {
    const classes = useStyles();
    const { addTests } = useConfigActions();
    const { setFileManager } = useFileManagerActions();
    const [state, _setState] = useState<TasksAdditionStateModel>({ inputsFiles: [], outputsFiles: [], mergedFiles: [] });
    const setState = (type: string, value: any | ((arg1: any) => any)) => {
        _setState((pvState: any) => ({
            ...pvState,
            [type]: typeof value === 'function' ? value(pvState[type]) : value,
        }));
    };
    return (
        <>
            <div className={classes.TasksAddition}>
                <div className={classes.additionFormContainers}>
                    <div className={classes.additionFormContainer}>
                        <AdditionForm
                            setFileManager={setFileManager}
                            title={'INPUTS'}
                            selectedFiles={state.inputsFiles}
                            setSelectedFiles={(newPaths: Array<string>) => {
                                setState('inputsFiles', newPaths);
                            }}
                        />
                    </div>
                    <div className={classes.mergedFilesTableContainer}>
                        <MergeFilesForm
                            inputsFiles={state.inputsFiles}
                            outputsFiles={state.outputsFiles}
                            mergedFiles={state.mergedFiles}
                            setMergedFiles={(newFiles: Array<MergedFilesModel>) => {
                                setState('mergedFiles', newFiles);
                            }}
                        />
                        <MergedFilesTable mergedFiles={state.mergedFiles} />
                    </div>
                    <div className={classes.additionFormContainer}>
                        <AdditionForm
                            setFileManager={setFileManager}
                            title={'OUTPUTS'}
                            selectedFiles={state.outputsFiles}
                            setSelectedFiles={(newPaths: Array<string>) => {
                                setState('outputsFiles', newPaths);
                            }}
                            mirrored={true}
                        />
                    </div>
                </div>
                <div className={classes.submitButton}>
                    <Button
                        onClick={() =>
                            addTests(
                                state.mergedFiles.map((file) => ({
                                    inputPath: file.inputPath.path,
                                    outputPath: file.outputPath ? file.outputPath.path : null,
                                }))
                            )
                        }
                        fullWidth
                        disabled={!state.mergedFiles.length}
                    >{`Add ${state.mergedFiles.length} tasks`}</Button>
                </div>
            </div>
        </>
    );
};

export default TasksAddition;
