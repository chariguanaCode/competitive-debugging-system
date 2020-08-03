import React, { useState, useEffect } from 'react';
import useStyles from './Form.css';
import { FormPropsModel, FormStateModel } from './Form.d';
import { IconButton, TextField } from '@material-ui/core';
import { FileModel } from 'components/FileManager/FileManager.d';
import { loadFilesOnDirectoryAncestors } from 'backend/filesHandlingFunctions';
import { asyncForEach, mergeArrays } from 'utils/tools';
import { FolderOpen as FolderOpenIcon } from '@material-ui/icons';
import {AdditionFormStateModel} from '../AdditionForm/AdditionForm.d'
export const Form: React.FunctionComponent<FormPropsModel> = ({
    regex,
    setRegex,
    setFileManager,
    setFilteredFiles,
    filteredFiles,
    title,
    pendingFiles,
    setPendingFiles,
}) => {
    const classes = useStyles();

    // TODO: directories handle: two modes: all predecessors or just child
    // now can't handle directories
    // DO IT MORE EFFICIENT WAY
    const selectFiles = async (files: Array<FileModel>) => {
        let filesToSet: FormPropsModel['pendingFiles'] = [];
        await asyncForEach(files, async (file: FileModel) => {
            if (file.type === 'DIRECTORY') {
                return (filesToSet = filesToSet.concat(
                    (
                        await loadFilesOnDirectoryAncestors({ directory: file.path, lim: 1 })
                    )[0] /*.map(
                        (file: FileModel) => file.path
                    )*/
                ));
            }

            return filesToSet.push(file);
        });
        setPendingFiles((pvState: AdditionFormStateModel) => mergeArrays(pvState.pendingFiles, filesToSet));
    };

    return (
        <>
            <div className={classes.Form}>
                <div className={classes.titleContainer}>{title}</div>
                {/* TODO: MOVE TO ANOTHER COMPONENT TOO AVOID RERENDERS*/}
                <div className={classes.selectFilesButtonContainer}>
                    <IconButton onClick={() => setFileManager({ open: true, selectFiles: selectFiles, withFilesStats: true })}>
                        <FolderOpenIcon />
                    </IconButton>
                </div>
                <div className={classes.regexTextFieldContainer}>
                    <TextField
                        value={regex}
                        onChange={(e) => {
                            e.persist();
                            setRegex(e.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                        label={'Regex to filter pending files'}
                    />
                </div>
            </div>
        </>
    );
};

export default Form;
