import React, { useState } from 'react';
import useStyles from './MergeFilesForm.css';
import { MergeFilesFormPropsModel, MergeFilesFormStateModel } from './MergeFilesForm.d';
import { MergedFilesModel } from '../../TestsAddition.d';
import { Button, Select, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core';
import mergingFilesDefaultFunctions from 'data/mergingFilesDefaultFunctions';
import determineTestDataDefaultFunctions from 'data/determineTestDataDefaultFunctions';

import { useCommonState } from 'utils';
export const MergeFilesForm: React.FunctionComponent<MergeFilesFormPropsModel> = ({
    inputsFiles,
    outputsFiles,
    mergedFiles,
    setMergedFiles,
}) => {
    const classes = useStyles();
    const mergingFunctionsNames = Object.keys(mergingFilesDefaultFunctions);
    const mergingFunctionsArray = Object.entries(mergingFilesDefaultFunctions);
    const determineTestDataFunctionsArray = Object.entries(determineTestDataDefaultFunctions);
    const [state, setState] = useCommonState<MergeFilesFormStateModel>({
        selectedMergeFunction: mergingFunctionsArray[0][1].name,
        selectedDetermineTestDataFunction: determineTestDataFunctionsArray[0][1].name,
        doAddInputsWithoutOutputs: false,
    });

    const mergeFiles = () => {
        let newMergedFilesObject: { [key: string]: MergedFilesModel } = {};
        const selectedMergingFunctionObject = mergingFilesDefaultFunctions[state.selectedMergeFunction];

        inputsFiles.forEach((file: typeof inputsFiles[0]) => {
            newMergedFilesObject[selectedMergingFunctionObject.inputKey(file)] = {
                inputPath: file,
                outputPath: null,
                name: file.path,
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

        const selectedDetermineTestDataFunctionObject =
            determineTestDataDefaultFunctions[state.selectedDetermineTestDataFunction];

        newMergedFilesArray.forEach((value, index) => {
            newMergedFilesArray[index].name = selectedDetermineTestDataFunctionObject.nameKey(
                value.inputPath,
                value.outputPath
            );
        });
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
                            setState('selectedMergeFunction', e.target.value as string);
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
                <div className={classes.determineTestDataRuleSelectContainer}>
                    <Select
                        value={state.selectedDetermineTestDataFunction}
                        onChange={(e) => {
                            e.persist();
                            setState('selectedDetermineTestDataFunction', e.target.value as string);
                        }}
                        label={'merge rule'}
                        classes={{ root: classes.determineTestDataRuleSelectRoot}}
                    >
                        {determineTestDataFunctionsArray.map(([key, value]) => (
                            <MenuItem key={value.name} value={value.name}>
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
