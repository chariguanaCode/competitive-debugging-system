import React, { useState, useEffect } from 'react';
import useStyles from './Form.css';
import { FormPropsModel, FormStateModel } from './Form.d';
import { IconButton, TextField } from '@material-ui/core';
import { FileModel } from 'components/FileManager/FileManager.d';
import { loadFilesOnDirectoryAncestors } from 'backend/filesHandlingFunctions';
import { asyncForEach, mergeArrays } from 'utils/tools';
import { FolderOpen as FolderOpenIcon } from '@material-ui/icons';
import { useCommonState } from 'utils';

export const Form: React.FunctionComponent<FormPropsModel> = ({ setFileManager, title, mirrored, setSelectedFiles }) => {
    const classes = useStyles({ mirrored: mirrored });
    const [state, setState] = useCommonState<FormStateModel>({
        pendingFiles: [],
        regex: '',
    });

    useEffect(() => {
        let regexp = new RegExp('');
        try {
            regexp = new RegExp(state.regex);
        } catch {}
        setSelectedFiles(state.pendingFiles.filter((file) => file.path.match(regexp)));
    }, [state.regex, state.pendingFiles]);

    // TODO: directories handle: two modes: all predecessors or just child
    // now can't handle directories
    // DO IT MORE EFFICIENT WAY
    const selectFiles = async (files: Array<FileModel>) => {
        let filesToSet: typeof state.pendingFiles = [];
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
        // TO DO FIX MERGING OBJECTS
        setState('pendingFiles', (pvPendingFiles) => mergeArrays(pvPendingFiles, filesToSet));
    };

    return (
        <>
            <div className={classes.Form}>
                <div className={classes.titleContainer}>{title}</div>
                <div className={classes.selectFilesButtonContainer}>
                    <IconButton onClick={() => setFileManager({ open: true, selectFiles: selectFiles, withFilesStats: true })}>
                        <FolderOpenIcon />
                    </IconButton>
                </div>
                <div className={classes.regexTextFieldContainer}>
                    <TextField
                        value={state.regex}
                        onChange={(e) => {
                            e.persist();
                            setState('regex', e.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                        label={`Regex to filter ${title}`}
                    />
                </div>
            </div>
        </>
    );
};

export default Form;
