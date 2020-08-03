import React, { useState, useEffect } from 'react';
import useStyles from './AdditionForm.css';
import clsx from 'clsx';
import { AdditionFormPropsModel, AdditionFormStateModel } from './AdditionForm.d';
import { Button, TextField } from '@material-ui/core';
import { ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { mergeArrays, asyncForEach } from 'utils/tools';
import { FileModel } from 'components/FileManager/FileManager.d';
import { loadFilesOnDirectoryAncestors } from 'backend/filesHandlingFunctions';
import { PathsList } from 'modules/TasksManagement/components';

export const AdditionForm: React.FunctionComponent<AdditionFormPropsModel> = ({
    title,
    setSelectedFiles,
    selectedFiles,
    setFileManager,
    mirrored = false,
}) => {
    const classes = useStyles();
    const [pendingFiles, setPendingFiles] = useState<Array<string>>([]);
    const [filteredFiles, setFilteredFiles] = useState<Array<string>>([]);
    const [regex, setRegex] = useState<string>('');

    // TODO: directories handle: two modes: all predecessors or just child
    // now can't handle directories
    // DO IT MORE EFFICIENT WAY
    const selectFiles = async (files: Array<FileModel>) => {
        let filesToSet: Array<string> = [];
        await asyncForEach(files, async (file: FileModel) => {
            if (file.type === 'DIRECTORY') {
                return (filesToSet = filesToSet.concat(
                    (await loadFilesOnDirectoryAncestors({ directory: file.path, lim: 1 }))[0].map(
                        (file: FileModel) => file.path
                    )
                ));
            }

            return filesToSet.push(file.path);
        });
        setPendingFiles((pvPendingFiles: Array<string>) => mergeArrays(pvPendingFiles, filesToSet));
    };

    const addFilteredFiles = () => {
        // TODO: possible async error
        setPendingFiles((pvPendingFiles) => pvPendingFiles.filter((path) => !filteredFiles.includes(path)));
        setSelectedFiles((pvSelectedFiles: Array<string>) => mergeArrays(pvSelectedFiles, filteredFiles));
    };

    useEffect(() => {
        let regexp = new RegExp('');
        try {
            regexp = new RegExp(regex);
        } catch {}
        setFilteredFiles(pendingFiles.filter((path) => path.match(regexp)));
    }, [regex, pendingFiles]);

    return (
        <>
            <div className={classes.AdditionForm}>
                <div className={classes.titleContainer}>{title}</div>
                <div className={classes.selectFilesForm}>
                    {/* TODO: MOVE TO ANOTHER COMPONENT TOO AVOID RERENDERS*/}
                    <Button onClick={() => setFileManager({ open: true, selectFiles: selectFiles, withFilesStats: true })}>
                        Select files
                    </Button>
                    <TextField
                        value={regex}
                        onChange={(e) => {
                            e.persist();
                            setRegex(e.target.value);
                        }}
                        label={'Regex to filter pending files'}
                    />
                </div>
                <div className={classes.filesListContainers}>
                    <div className={clsx(classes.filesListContainer, classes.pendingFilesListContainer)}>
                        <PathsList paths={filteredFiles} />
                    </div>
                    <div className={classes.selectFilesContainer}>
                        <Button onClick={addFilteredFiles}>Add {filteredFiles.length.toString()} files</Button>
                        {mirrored ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    </div>
                    <div className={clsx(classes.filesListContainer, classes.selectedFilesListContainer)}>
                        <PathsList paths={selectedFiles} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdditionForm;
