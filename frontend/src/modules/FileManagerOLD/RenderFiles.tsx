import React, { memo } from 'react';
import {
    Description as DescriptionIcon,
    DeveloperBoard as DeveloperBoardIcon,
    Folder as FolderOutlinedIcon,
    Image as ImageIcon,
    InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
    Movie as MovieIcon,
} from '@material-ui/icons';
import useStyles from './RenderFilesStyles';
import { RenderFilesProps } from './Types';

const arePropsEqual = (prevProps: RenderFilesProps, nextProps: RenderFilesProps) => {
    return prevProps.renderForce === nextProps.renderForce;
};

const ShowIcon: React.FunctionComponent<{ fileType: string; classes: any }> = ({ fileType, classes }) => {
    switch (fileType) {
        case 'DIRECTORY':
            return <FolderOutlinedIcon className={classes.fileIcon} style={{ color: '#ffee58' }} />;
        case 'IMAGE':
            return <ImageIcon className={classes.fileIcon} style={{ color: '#66bb6a' }} />;
        case 'MOVIE':
            return <MovieIcon className={classes.fileIcon} style={{ color: '#4db6ac' }} />;
        case 'DOCUMENT':
            return <DescriptionIcon className={classes.fileIcon} style={{ color: '#757575' }} />;
        case 'EXECUTABLE':
            return <DeveloperBoardIcon className={classes.fileIcon} style={{ color: '#aa00ff' }} />;
        default:
            return <InsertDriveFileOutlinedIcon className={classes.fileIcon} />;
    }
};

export const RenderFiles: React.FunctionComponent<RenderFilesProps> = memo(
    ({
        acceptableFileTypes,
        onFileKeyDown,
        saveRefs,
        setFilesRefs,
        renderFilesLimit,
        files,
        selectedFiles,
        onFileClick,
        renderForce,
        showDeleteFileFromSelectedFilesButton,
        mouseOverPath,
        startIndex = 0,
        filesDisplaySize,
    }) => {
        let iterator = -1;
        let filesRefs = new Array(startIndex + renderFilesLimit);
        let renderDividor = renderFilesLimit;
        let displaySettingsStyle = {
            fileButtonWidth: filesDisplaySize > 90 ? '100%' : Math.ceil(filesDisplaySize * 3.2).toString() + 'px',
            fileTextSize: Math.ceil(filesDisplaySize / (100 / 13)).toString() + 'px !important',
            fileIconWidth: filesDisplaySize > 90 ? '20px' : (filesDisplaySize * 3).toString() + 'px',
            fileView: {
                flexDirection: filesDisplaySize > 90 ? 'row' : 'column',
                justifyContent: filesDisplaySize > 90 ? 'left' : 'center',
            },
        };

        const classes = useStyles(displaySettingsStyle);
        return (
            <div style={{ display: 'inline' }} id={`renderFiles${startIndex.toString()}`}>
                {files.map((file, index) => {
                    let isSelected = selectedFiles.has(file.path);
                    let isAcceptable = acceptableFileTypes ? acceptableFileTypes.has(file.type) : true;
                    ++iterator;
                    return (
                        <div
                            key={`renderFiles${startIndex.toString()}File${index}`}
                            style={{ display: 'inline', position: 'relative', padding: '2px' }}
                            onKeyDown={
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
                            }
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
                                className={
                                    (isSelected ? classes.fileButtonSelected + ' fileButton-selected' : classes.fileButton) +
                                    ' ' +
                                    (isAcceptable ? 'fileButton-acceptable' : '')
                                }
                                ref={
                                    saveRefs
                                        ? (ref) => {
                                              setFilesRefs(index + startIndex, ref);
                                              return true;
                                          }
                                        : null
                                }
                                onClick={(e) => {
                                    onFileClick(file, e, isSelected, startIndex / renderDividor);
                                }}
                                disabled={acceptableFileTypes && file.type !== 'DIRECTORY' && !isAcceptable}
                                data-path={file.path}
                                data-renderblockid={startIndex / renderDividor}
                            >
                                <div className={classes.fileView}>
                                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                        <ShowIcon classes={classes} fileType={file.typeGroup} />
                                    </div>

                                    <div
                                        id={`testID${startIndex.toString()}`}
                                        style={{
                                            fontSize: displaySettingsStyle.fileTextSize,
                                            wordBreak: 'break-all',
                                            display: 'flex',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {file.name}
                                    </div>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    },
    arePropsEqual
);

export default RenderFiles;
