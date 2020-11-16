import React, { useState } from 'react';
import useStyles from './TestsAddition.css';
import { TasksAdditionPropsModel, TasksAdditionStateModel, MergedFilesModel } from './TestsAddition.d';
import { AdditionForm, MergedFilesTable, MergeFilesForm, TestsGroupForm } from './components';
import { useFileManagerActions, useConfigActions } from 'reduxState/actions';
import { Button } from '@material-ui/core';
import { useConfig } from 'reduxState/selectors';
import { TestModel } from 'reduxState/models';
import { FileModel } from 'components/FileManager/FileManager.d';
import { useCommonState } from 'utils';

export const TasksAddition: React.FunctionComponent<TasksAdditionPropsModel> = ({}) => {
    const classes = useStyles();
    const config = useConfig();
    const { addTests, increaseNextTestId, increaseNextGroupId } = useConfigActions();
    const { setFileManager } = useFileManagerActions();
    const [state, setState] = useCommonState<TasksAdditionStateModel>({
        inputsFiles: [],
        outputsFiles: [],
        mergedFiles: [],
        selectedTestsGroupId: Object.keys(config.tests.groups)[0], // TODO: better way
    });

    const _addTests = () => {
        const localNextTestId = Number(config.tests.nextTestId);
        increaseNextTestId(state.mergedFiles.length); // TODO: maybe add it to reducer
        let newTestsObject: { [key: string]: TestModel } = {};
        state.mergedFiles.forEach((file, index) => {
            newTestsObject[(localNextTestId + index).toString()] = {
                name: file.inputPath.path,
                inputPath: file.inputPath.path,
                outputPath: file.outputPath ? file.outputPath.path : null,
            };
        });
        addTests({
            [state.selectedTestsGroupId]: {
                name: config.tests.groups[state.selectedTestsGroupId].name,
                tests: newTestsObject,
            },
        });
    };
    const _addGroup = () => {
        const localNextGroupId = config.tests.nextGroupId;
        increaseNextGroupId(1); // TODO: maybe add it to reducer
        addTests({
            [localNextGroupId]: {
                name: `Tests Group ${localNextGroupId}`,
                tests: {},
            },
        });
        return localNextGroupId;
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
                            setSelectedFiles={(newPaths: Array<FileModel>) => {
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
                            setSelectedFiles={(newPaths: Array<FileModel>) => {
                                setState('outputsFiles', newPaths);
                            }}
                            mirrored={true}
                        />
                    </div>
                </div>
                <div className={classes.submitButton}>
                    <Button
                        classes={{ root: classes.submitButtonRoot }}
                        onClick={_addTests}
                        disabled={!state.mergedFiles.length}
                    >{`Add ${state.mergedFiles.length} tests`}</Button>
                    <div className={classes.groupSelectLabel}></div>
                    <TestsGroupForm
                        testsGroupsArray={Object.keys(config.tests.groups).map((key) => ({
                            id: key,
                            name: config.tests.groups[key].name,
                        }))}
                        addGroup={_addGroup}
                        selectedTestsGroupId={state.selectedTestsGroupId}
                        setSelectedTestsGroupId={(groupId: string) => {
                            setState('selectedTestsGroupId', groupId);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default TasksAddition;
