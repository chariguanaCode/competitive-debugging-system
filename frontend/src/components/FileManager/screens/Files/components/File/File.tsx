import React from 'react';
import clsx from 'clsx';
import useStyles from './File.css';
import { FilePropsModel } from './File.d';
import FileIcon from '../FileIcon';
export const File: React.FunctionComponent<FilePropsModel> = ({ file, isSelected, isAcceptable, onFileClick, fileIndex }) => {
    const classes = useStyles(/*displaySettingsStyle*/);
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
            style={{ display: 'inline', position: 'relative', padding: '2px' }}
            /*onKeyDown={
                file.type === 'DIRECTORY'
                    ? (e) => {
                          onFileKeyDown(e, file.path);
                      }
                    : () => {}
            }
            onMouseEnter={
                file.type === 'DIRECTORY' && isSelected
                    ? () => {
                          showDeleteFileFromSelectedFilesButton(file.path, '', startIndex / renderDividor);
                      }
                    : () => {}
            }
            onMouseLeave={
                file.type === 'DIRECTORY' && isSelected
                    ? () => {
                          showDeleteFileFromSelectedFilesButton('', file.path, startIndex / renderDividor);
                      }
                    : () => {}
            }*/
        >
            {/* (file.type === "DIRECTORY" && file.path === mouseOverPath) ? 
                    <Fade in={true}>
                        <IconButton
                            className = {classes.iconButtonButton}
                            onClick = {() => {showDeleteFileFromSelectedFilesButton("", file.path, startIndex/renderDividor); onFileClick(file, {which: 3}, true, startIndex/renderDividor)}}
                        >
                            <ClearIcon className ={classes.iconButtonIcon}/>
                        </IconButton>
                    </Fade> : null
    */}
            <button
                className={clsx(classes.FileButton, {
                    [`${classes.selectedFileButton} file-selected`]: isSelected,
                    'file-acceptable': isAcceptable,
                })}
                onClick={(e) => {
                    onFileClick(file, e, isSelected, fileIndex);
                }}
                disabled={file.type !== 'DIRECTORY' && !isAcceptable}
                data-path={file.path}
            >
                <div className={classes.FileButtonContent}>
                    <div className={classes.FileIconContainer}>
                        <FileIcon fileType={file.typeGroup} />
                    </div>
                    <div className={classes.filenameContainer}>{file.name}</div>
                </div>
            </button>
        </div>
    );
};

export default File;
