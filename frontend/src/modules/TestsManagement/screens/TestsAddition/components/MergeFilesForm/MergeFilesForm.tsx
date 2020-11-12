import React, { useState } from 'react';
import useStyles from './MergeFilesForm.css';
import { MergeFilesFormPropsModel, MergeFilesFormStateModel } from './MergeFilesForm.d';
import { MergedFilesModel } from '../../TasksAddition.d';
import { Button, Select, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core';
import mergingFilesDefaultFunctions from 'data/mergingFilesDefaultFunctions';

export const MergeFilesForm: React.FunctionComponent<MergeFilesFormPropsModel> = ({
    inputsFiles,
    outputsFiles,
    mergedFiles,
    setMergedFiles,
}) => {
    const classes = useStyles();
    const mergingFunctionsNames = Object.keys(mergingFilesDefaultFunctions);
    const mergingFunctionsArray = Object.entries(mergingFilesDefaultFunctions);
    const [state, _setState] = useState<MergeFilesFormStateModel>({
        selectedMergeFunction: mergingFunctionsArray[0][1].name,
        doAddInputsWithoutOutputs: false,
    });

    const setState = (type: string, value: any | ((arg1: any) => any)) => {
        _setState((pvState: any) => ({
            ...pvState,
            [type]: typeof value === 'function' ? value(pvState) : value,
        }));
    };

    const mergeFiles = () => {
        let newMergedFilesObject: { [key: string]: MergedFilesModel } = {};
        const selectedMergingFunctionObject = mergingFilesDefaultFunctions[state.selectedMergeFunction];
        inputsFiles.forEach((file: typeof inputsFiles[0]) => {
            newMergedFilesObject[selectedMergingFunctionObject.inputKey(file)] = {
                inputPath: file,
                outputPath: null,
            };
        });
        outputsFiles.forEach((file: typeof outputsFiles[0]) => {
            const outputFileKey = selectedMergingFunctionObject.outputKey(file);
            if (newMergedFilesObject.hasOwnProperty(outputFileKey)) {
                newMergedFilesObject[outputFileKey].outputPath = file;
            }
        });
        let newMergedFilesArray = Object.values(newMergedFilesObject).filter(
            (task: MergedFilesModel) => state.doAddInputsWithoutOutputs || task.outputPath
        );
        setMergedFiles(newMergedFilesArray);
    };
    return (
        <>
            <div className={classes.MergeFilesForm}>
                <div className={classes.mergeFilesButtonContainer}>
                    <Button onClick={mergeFiles}>Merge files</Button>
                </div>
                <div className={classes.mergeRuleSelectContainer}>
                    <Select
                        value={state.selectedMergeFunction}
                        onChange={(e) => {
                            e.persist();
                            setState('selectedMergeFunction', e.target.value);
                        }}
                        label={'merge rule'}
                    >
                        {mergingFunctionsArray.map(([key, value]) => (
                            <MenuItem key={`select-merging-function-${value.name}`} value={value.name}>
                                {value.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div className={classes.addNotMatchedInputsCheckboxContainer}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={state.doAddInputsWithoutOutputs}
                                onChange={(e) => {
                                    e.persist();
                                    setState('doAddInputsWithoutOutputs', e.target.checked);
                                }}
                            />
                        }
                        label={'add not matched inputs'}
                    />
                </div>
            </div>
        </>
    );
};

export default MergeFilesForm;
