import React, { useEffect, useState, useRef } from 'react';
import useStyles from './TestsEdition.css';
import { TestsEditionPropsModel, TestsEditionStateModel } from './TestsEdition.d';
import { useCommonState } from 'utils';
import { useConfig, useFileManager } from 'reduxState/selectors';
import { useConfigActions, useFileManagerActions } from 'reduxState/actions';
import { TextField, Button, InputAdornment, IconButton, Select, MenuItem } from '@material-ui/core';
import { Folder as FolderIcon } from '@material-ui/icons';
import { close } from 'fs';
export const TestsEdition: React.FunctionComponent<TestsEditionPropsModel> = ({ testId, groupId, closeTestEditionDialog }) => {
    const classes = useStyles();
    const config = useConfig();
    const { addTests, editTests } = useConfigActions();
    const { setFileManager } = useFileManagerActions();
    const [state, setState, __setState, _setState] = useCommonState<TestsEditionStateModel>(() => {
        if (testId && groupId) {
            const currentTest = config.tests.groups[groupId].tests[testId];
            if (currentTest) {
                return {
                    name: currentTest.name,
                    inputPath: currentTest.inputPath,
                    outputPath: currentTest.outputPath ? currentTest.outputPath : '',
                    groupId: groupId,
                };
            }
        }
        return {
            name: '',
            inputPath: '',
            outputPath: '',
            groupId: '0',
        };
    });

    const setTextFieldValue = (e: any) => {
        if (e.persist) e.persist();
        setState(e.target.name, e.target.value);
    };

    const selectProjectLocation = (e: any) => {
        e.persist();
        const currentTargetName = e.currentTarget.name;
        setFileManager({
            maxNumberOfSelectedFiles: 1,
            selectFiles: (files: Array<string>) => setTextFieldValue({ target: { value: files[0], name: currentTargetName } }),
            open: true,
            acceptableFilesExtensions: ['DIRECTORY'],
        });
    };

    const submitChanges = () => {
        if (groupId && testId) {
            const currentTest = { ...config.tests.groups[groupId].tests[testId], groupId: groupId } as TestsEditionStateModel;
            let newTestValue: { [key: string]: any } = {};
            let property: keyof TestsEditionStateModel;
            for (property in state) if (state[property] !== currentTest[property]) newTestValue[property] = state[property];
            if (Object.keys(newTestValue).length)
                editTests({
                    [groupId]: {
                        [testId]: {
                            ...state,
                        },
                    },
                });
            closeTestEditionDialog();
        }
    };

    return (
        <>
            <div className={classes.TestsEdition}>
                <div className={classes.FormContainer}>
                    <div className={classes.FormElement}>
                        <div className={classes.FormElementLabel}>Name</div>
                        <div className={classes.FormElementTextFieldContainer}>
                            <TextField
                                autoFocus
                                fullWidth
                                value={state.name}
                                name="name"
                                onChange={setTextFieldValue}
                                onFocus={(e) => {
                                    e.target.select();
                                }}
                            />
                        </div>
                    </div>
                    <div className={classes.FormElement}>
                        <div className={classes.FormElementLabel}>Input</div>
                        <div className={classes.FormElementTextFieldContainer}>
                            <TextField
                                fullWidth
                                value={state.inputPath}
                                name="inputPath"
                                onChange={setTextFieldValue}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton name="inputPath" onClick={selectProjectLocation}>
                                                <FolderIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                    <div className={classes.FormElement}>
                        <div className={classes.FormElementLabel}>Output</div>
                        <div className={classes.FormElementTextFieldContainer}>
                            <TextField
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton name="outputPath" onClick={selectProjectLocation}>
                                                <FolderIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                                value={state.outputPath}
                                name="outputPath"
                                onChange={setTextFieldValue}
                            />
                        </div>
                    </div>
                    <div className={classes.FormElement}>
                        <div className={classes.FormElementLabel}>Group</div>
                        <div className={classes.FormElementTextFieldContainer}>
                            <Select value={state.groupId} onChange={setTextFieldValue} name={'groupId'}>
                                {Object.entries(config.tests.groups).map(([groupId, value]) => (
                                    <MenuItem key={groupId} value={groupId}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
                <div className={classes.FooterButtonsContainer}>
                    <Button fullWidth classes={{ root: classes.FooterButtonRoot }} onClick={closeTestEditionDialog}>
                        Cancel
                    </Button>
                    <Button fullWidth classes={{ root: classes.FooterButtonRoot }} onClick={submitChanges}>
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
};

export default TestsEdition;
