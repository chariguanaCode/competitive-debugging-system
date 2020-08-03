import React, { useState, useEffect } from 'react';
import useStyles from './AdditionForm.css';
import clsx from 'clsx';
import { AdditionFormPropsModel, AdditionFormStateModel } from './AdditionForm.d';
import { Button, TextField } from '@material-ui/core';
import { ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { mergeArrays } from 'utils/tools';
import { PathsList } from 'modules/TasksManagement/components';
import { Form } from '..';
import { FileModel } from 'components/FileManager/FileManager.d';

export const AdditionForm: React.FunctionComponent<AdditionFormPropsModel> = ({
    title,
    setSelectedFiles,
    selectedFiles,
    setFileManager,
    mirrored = false,
}) => {
    const classes = useStyles();
    const [state, _setState] = useState<AdditionFormStateModel>({
        pendingFiles: [],
        filteredFiles: [],
        regex: '',
    });
    console.log(state, selectedFiles)
    const setState = (type: string, value: any | ((arg1: any) => any)) => {
        _setState((pvState: any) => ({
            ...pvState,
            [type]: typeof value === 'function' ? value(pvState) : value,
        }));
    };
    const addFilteredFiles = () => {
        // TODO: possible async error
        setState('pendingFiles', (pvState: AdditionFormStateModel) =>
            pvState.pendingFiles.filter((file: FileModel) => !pvState.filteredFiles.includes(file))
        );
        setSelectedFiles((pvSelectedFiles: Array<FileModel>) => mergeArrays(pvSelectedFiles, state.filteredFiles));
    };

    useEffect(() => {
        let regexp = new RegExp('');
        try {
            regexp = new RegExp(state.regex);
        } catch {}
        setState('filteredFiles', (pvState: AdditionFormStateModel) =>
            pvState.pendingFiles.filter((file) => file.path.match(regexp))
        );
    }, [state.regex, state.pendingFiles]);
    return (
        <>
            <div className={classes.AdditionForm}>
                <div className={classes.selectFilesForm}>
                    <Form
                        regex={state.regex}
                        setRegex={(newRegex: AdditionFormStateModel['regex']) => setState('regex', newRegex)}
                        setFileManager={setFileManager}
                        setFilteredFiles={addFilteredFiles}
                        filteredFiles={state.filteredFiles}
                        pendingFiles={state.pendingFiles}
                        setPendingFiles={(newPendingFiles: AdditionFormStateModel['pendingFiles']) =>
                            setState('pendingFiles', newPendingFiles)
                        }
                        title={title}
                    />
                </div>
                <div className={classes.filesListContainers}>
                    <div className={clsx(classes.filesListContainer, classes.pendingFilesListContainer)}>
                        <PathsList paths={state.filteredFiles.map((file) => file.path)} />
                    </div>
                    <div className={classes.selectFilesContainer}>
                        <Button onClick={addFilteredFiles}>Add {state.filteredFiles.length.toString()} files</Button>
                        {mirrored ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    </div>
                    <div className={clsx(classes.filesListContainer, classes.selectedFilesListContainer)}>
                        <PathsList paths={selectedFiles.map((file) => file.path)} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdditionForm;
