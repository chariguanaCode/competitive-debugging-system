import React, { useState } from 'react';
import { List } from 'react-virtualized';
import { File } from './components';
import { FilesPropsModel } from './Files.d';
import { FileModel } from '../../FileManager.d';
import { checkIfActiveElementIsInput, isNumeric, isRightButton, sortStringCompare } from 'utils/tools';
import useStyles from './Files.css';

const Files: React.FunctionComponent<FilesPropsModel> = ({
    maxNumberOfSelectedFiles,
    setSelectedFiles,
    selectedFiles,
    loadDirectory,
    files,
    acceptableFilesExtensions,
}) => {
    const classes = useStyles();

    const handleSelectedFiles = (selectedFilesToSet: Set<string>, idsToRerender: Array<number>, e?: any) => {
        if (selectedFilesToSet.size > maxNumberOfSelectedFiles) {
            //setErrorSnackbarMessage(`Maximum number of selected files is ${maxNumberOfSelectedFiles}`);
            return;
        }
        //if(e) e.target.style.backgroundColor = "red"
        setSelectedFiles(selectedFilesToSet);
    };

    const onFileClick = (file: FileModel, e: any, fileIsAlreadyClicked = false, id: number) => {
        if (e.persist) e.persist();
        let isRightMB = isRightButton(e);
        if (!acceptableFilesExtensions || acceptableFilesExtensions.has(file.type)) {
            let selectedFilesSet = new Set(selectedFiles);
            if ((fileIsAlreadyClicked && isRightMB) || (fileIsAlreadyClicked && file.type !== 'DIRECTORY')) {
                selectedFilesSet.delete(file.path);
            }
            if (fileIsAlreadyClicked && file.type === 'DIRECTORY' && !isRightMB) {
                selectedFilesSet.delete(file.path);
                handleSelectedFiles(selectedFilesSet, []);
                loadDirectory({ path: file.path });
            } else if (!isRightMB && !fileIsAlreadyClicked) {
                selectedFilesSet.add(file.path);
                handleSelectedFiles(selectedFilesSet, [id], e);
            } else {
                handleSelectedFiles(selectedFilesSet, [id], e);
            }
        } else if (file.type === 'DIRECTORY') {
            loadDirectory({ path: file.path });
        }
    };

    let renderRow = ({ index, key, style }: { index: number; key: string; style: any }) => {
        const file = files[index];

        let isSelected = selectedFiles.has(file.path);
        let isAcceptable = acceptableFilesExtensions ? acceptableFilesExtensions.has(file.type) : true;

        return (
            <div key={key} style={style}>
                <File
                    isSelected={isSelected}
                    isAcceptable={isAcceptable}
                    file={file}
                    onFileClick={onFileClick}
                    fileIndex={index}
                />
            </div>
        );
    };

    return (
        <>
            <div className={classes.Files}>
                <List rowRenderer={renderRow} width={300} height={300} rowCount={files.length} rowHeight={50}></List>
            </div>
        </>
    );
};

export default Files;
