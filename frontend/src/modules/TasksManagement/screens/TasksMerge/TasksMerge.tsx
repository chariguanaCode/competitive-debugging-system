import React, { useState } from 'react';
import useStyles from './TasksMerge.css';
import { TasksMergePropsModel, TasksMergeStateModel, mergedFilesModel } from './TasksMerge.d';
import { PathsList } from 'modules/TasksManagement/components';
import { Button, Select, MenuItem, Checkbox } from '@material-ui/core';
import mergingFilesDefaultFunctions from 'data/mergingFilesDefaultFunctions';

export const TasksMerge: React.FunctionComponent<TasksMergePropsModel> = ({ inputsFiles, outputsFiles, showLists = true }) => {
    const classes = useStyles();
    const mergingFunctionsNames = Object.keys(mergingFilesDefaultFunctions);
    const mergingFunctionsArray = Object.entries(mergingFilesDefaultFunctions);
    const [state, _setState] = useState<TasksMergeStateModel>({
        selectedMergeFunction: mergingFunctionsArray[0][1].name,
        doAddInputsWithoutOutputs: false,
        mergedFiles: {},
    });
    const setState = (type: string, value: any | ((arg1: any) => any)) => {
        _setState((pvState: any) => ({
            ...pvState,
            [type]: typeof value === 'function' ? value(pvState) : value,
        }));
    };

    const mergeFiles = () => {
        let newMergedFilesObject: mergedFilesModel = {};
        const selectedMergingFunctionObject = mergingFilesDefaultFunctions[state.selectedMergeFunction];
        inputsFiles.forEach((file: typeof inputsFiles[0]) => {
            newMergedFilesObject[selectedMergingFunctionObject.inputKey(file)] = {
                inputPath: file.path,
                outputPath: null,
            };
        });
        outputsFiles.forEach((file: typeof outputsFiles[0]) => {
            const outputFileKey = selectedMergingFunctionObject.outputKey(file);
            if (newMergedFilesObject.hasOwnProperty(outputFileKey)) {
                newMergedFilesObject[outputFileKey].outputPath = file.path;
            }
        });
        setState('mergedFiles', newMergedFilesObject);
    };
    console.log(state.mergedFiles);
    return (
        <>
            <div className={classes.TasksMerge}>
                {showLists && (
                    <div className={classes.pathsListContainer}>
                        <PathsList paths={inputsFiles.map((file: typeof inputsFiles[0]) => file.name)} />
                    </div>
                )}
                <div className={classes.mergeSettingContainer}>
                    <Button onClick={mergeFiles}>Merge files</Button>
                    <Select
                        value={state.selectedMergeFunction}
                        onChange={(e) => {
                            e.persist();
                            setState('selectedMergeFunction', e.target.value);
                        }}
                    >
                        {mergingFunctionsArray.map(([key, value]) => (
                            <MenuItem value={value.name}>{value.name}</MenuItem>
                        ))}
                    </Select>
                    <Checkbox
                        checked={state.doAddInputsWithoutOutputs}
                        onChange={(e) => {
                            e.persist();
                            setState('doAddInputsWithoutOutputs', e.target.checked);
                        }}
                    />
                </div>
                {showLists && (
                    <div className={classes.pathsListContainer}>
                        <PathsList paths={outputsFiles.map((file: typeof outputsFiles[0]) => file.name)} />
                    </div>
                )}
            </div>
        </>
    );
};

export default TasksMerge;
