import React, { useState } from 'react';
import clsx from 'clsx';
import useStyles from './File.css';
import { FilePropsModel } from './File.d';
import FileIcon from '../FileIcon';
import { IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';

export const File: React.FunctionComponent<FilePropsModel> = ({
    file,
    isSelected,
    isAcceptable,
    onFileClick,
    fileIndex,
    onKeyDownOnFile,
    zoomFactor,
}) => {
    const displaySettings = {
        fontSize: `${13*zoomFactor}px`,
        fileIconWidth: `${24*zoomFactor}px`,
        fileIconHeight: `${24*zoomFactor}px`,
    };
    const classes = useStyles(displaySettings /*displaySettingsStyle*/);
    const [isMouseOverFile, setMouseIsOverFile] = useState<boolean>(false);
    // TODO: maybe create state in parent
    // TODO: close button

    /* let displaySettingsStyle = {
        fileButtonWidth: filesDisplaySize > 90 ? '100%' : Math.ceil(filesDisplaySize * 3.2).toString() + 'px',
        fileTextSize: Math.ceil(filesDisplaySize / (100 / 13)).toString() + 'px !important',
        fileIconWidth: filesDisplaySize > 90 ? '20px' : (filesDisplaySize * 3).toString() + 'px',
        fileView: {
            flexDirection: filesDisplaySize > 90 ? 'row' : 'column',
            justifyContent: filesDisplaySize > 90 ? 'left' : 'center',
        },
    };*/

    return (
        <div
            className={classes.fileButtonContainer}
            onKeyDown={(e) => onKeyDownOnFile(file, e, isSelected, fileIndex)}
            onMouseEnter={() => file.type === 'DIRECTORY' && isSelected && setMouseIsOverFile(true)}
            onMouseLeave={() => file.type === 'DIRECTORY' && setMouseIsOverFile(false)}
        >
            <button
                className={clsx(classes.FileButton, {
                    [`${classes.selectedFileButton} file-selected`]: isSelected,
                    'file-acceptable': isAcceptable,
                })}
                onMouseDown={(e) => {
                    onFileClick(file, e, isSelected, fileIndex);
                }}
                disabled={file.type !== 'DIRECTORY' && !isAcceptable}
                data-path={file.path}
            >
                <div className={classes.fileButtonContent}>
                    <div className={classes.fileIconContainer}>
                        <FileIcon fileType={file.typeGroup} />
                    </div>
                    <div className={classes.filenameContainer}>{file.name}</div>
                </div>
            </button>
            {isMouseOverFile && (
                // <Fade in={true}>
                <IconButton
                    className={classes.deleteFileFromSelectedFilesButton}
                    onClick={() => {
                        onFileClick(file, { which: 3 }, true, fileIndex);
                    }}
                >
                    <ClearIcon className={classes.deleteFileFromSelectedFilesIcon} />
                </IconButton>
                /// </Fade>
            )}
        </div>
    );
};

export default File;
