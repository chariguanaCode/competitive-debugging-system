import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    Slider,
    Snackbar,
} from '@material-ui/core';
import { Close as CloseIcon, Settings as SettingsIcon } from '@material-ui/icons';
import { getPartitionsNames, loadFilesOnDirectory } from '../../backend/filesHandlingFunctions';
import { checkIfActiveElementIsInput, isNumeric, isRightButton, sortStringCompare } from '../../utils/tools';
//import Alert from '../AlertComponent';
import useStyles from './FileManagerStyles';
import FoldersTree from './FoldersTree';
import MainToolbar from './MainToolbar';
import RenderFiles from './RenderFiles';
import SelectedFiles from './SelectedFiles';
import Selection from './Selection';
import Settings from './Settings';
import Toolbar from './Toolbar';
import { comparatorForFilesSort } from './Tools';
import { FileManagerProps, FileManagerState, FileType } from './Types';

export const FileManager: React.FunctionComponent<FileManagerProps> = ({
    maxNumberOfSelectedFiles = Infinity,
    minNumberOfSelectedFiles = 1,
    isFileManagerOpen,
    availableFilesTypes,
    acceptableFileTypes,
    selectFiles,
    loadDirectoryOnStart,
    dialogClose,
    config,
}) => {
  
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState('');
    const [advancedSettings, setAdvancedSettings] = useState({
        renderFilesLimit: 50,
    });
    const [loadingCircular, showLoadingCircular] = useState<boolean>(false);
    const [stateToRerenderSelf, rerenderSelf] = useState<boolean>(false);
    const [mouseSelectionStart, setMouseSelectionStart] = useState<
        | {
              x: number;
              y: number;
              isRightMB: boolean;
          }
        | undefined
    >(undefined);
    //const [fieldMode, updateFieldMode] = useState<boolean>(false)
    let previousHiddenSearch = useRef<any>(null);
    let lastSearchOnHiddenSearch = useRef<number>(0);
    let searchWord = useRef<string>('');
    let filesRefs = useRef<Array<any>>([]);
    let showFilesRenderForce = useRef<Array<number>>(new Array(10000));
    let isHiddenSearchOn = useRef<boolean>(true);
    let renderFilesLimit = advancedSettings.renderFilesLimit;

    /********************************
     *           USEEFFECT           *
     ********************************/

    useEffect(() => {
        renderForceFoo(-1);
    }, [state.filesDisplaySize]);

   
    const showDeleteFileFromSelectedFilesButton = (overPath: string, currentOverPath = '', id: number) => {
        if (currentOverPath === '' || currentOverPath === state.mouseOverPath) {
            renderForceFoo(id);
            setState((prevState) => ({
                ...prevState,
                mouseOverPath: overPath,
            }));
        }
    };

    const setFilesRefs = (where: number, refValue: any) => {
        filesRefs.current[where] = refValue;
    };

    /********************************
     *    ON KEY DOWN & SELECTION    *
     ********************************/

    const onMouseDownOnDialog = (e: any) => {
        if (
            e.target.tagName !== 'DIV' ||
            (e.target.id !== 'FileManager-DialogContent' && e.target.id !== 'FileManager-SelectedFiles')
        )
            return;
        e.persist();
        let isRightMB = isRightButton(e);
        setMouseSelectionStart({
            x: e.pageX,
            y: e.pageY,
            isRightMB: isRightMB,
        });
    };

    const onKeyDownOnFile = (e: any, path: string) => {
        if (e.keyCode === 13) {
            loadDirectory(path);
        }
    };

    const onKeyDownOnDialog = (e: any) => {
        if (e.keyCode === 27) dialogClose();
        else if (e.keyCode === 13) {
            //selectFiles([...selectedFiles.values()]);
            //dialogClose();
        } else if (e.keyCode === 37) return;
        else if (e.keyCode === 39) return;
        else if (isHiddenSearchOn.current && !checkIfActiveElementIsInput() && e.keyCode >= 49 && e.keyCode <= 125) {
            let currentTime = new Date().getTime();
            if (currentTime - lastSearchOnHiddenSearch.current >= 1000) {
                searchWord.current = '';
            }
            lastSearchOnHiddenSearch.current = currentTime;
            let key = e.keyCode;
            if (!e.shiftKey && key >= 65 && key <= 90) key += 32;
            searchWord.current += String.fromCharCode(key);
            hiddenSearch(searchWord.current);
        }
    };


    const changeFilesDisplaySize = (e: any, newValue: number) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            filesDisplaySize: newValue,
        }));
    };

    /********************************
     *         HIDDEN SEARCH         *
     ********************************/

    const hiddenSearch = (regex: string) => {
        if (previousHiddenSearch.current) previousHiddenSearch.current.style.backgroundColor = 'transparent';
        const regexExp = new RegExp(regex);
        for (let i = 0; i < state.files.length; ++i) {
            if (regexExp.test(state.files[i].name)) {
                filesRefs.current[i].focus();
                filesRefs.current[i].style.backgroundColor = '#e0e0e0';
                previousHiddenSearch.current = filesRefs.current[i];
                return;
            }
        }
    };

    /********************************/

    const classes = useStyles();
    let renderLimesArray = Array.from(
        { length: Math.ceil(state.files.length / renderFilesLimit) },
        (v, k) => k * renderFilesLimit
    );

    return (
        <>
            {mouseSelectionStart ? (
                <Selection
                    maxNumberOfSelectedFiles={maxNumberOfSelectedFiles}
                    selectedFilesState={state.selectedFiles}
                    startPosition={mouseSelectionStart}
                    filesRefs={filesRefs}
                    setSelectedFiles={setSelectedFiles}
                    endSelection={() => {
                        setMouseSelectionStart(undefined);
                    }}
                />
            ) : null}
            <Settings
                open={state.areSettingsOpen}
                dialogClose={() => {
                    setState((prevState) => ({
                        ...prevState,
                        areSettingsOpen: false,
                    }));
                }}
            />
            <Dialog
                onMouseDown={(e) => {
                    onMouseDownOnDialog(e);
                }}
                onKeyDown={(e) => {
                    onKeyDownOnDialog(e);
                }}
                scroll="body"
                classes={{ paper: classes.dialogPaper }}
                fullWidth={true}
                maxWidth="lg"
                className={classes.fileManager}
                open={Boolean(isFileManagerOpen)}
            >
                <div
                    style={{
                        zIndex: 10001,
                        position: 'absolute',
                        left: 'calc(50% - 20px)',
                        top: 'calc(50% - 20px)',
                    }}
                >
                    <Fade in={loadingCircular} style={{ transitionDelay: '100ms' }} unmountOnExit>
                        <CircularProgress size={40} />
                    </Fade>
                </div>
                <IconButton
                    style={{
                        position: 'absolute',
                        color: 'red',
                        right: '10px',
                        top: '10px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                    }}
                    onClick={() => {
                        dialogClose();
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <IconButton
                    style={{
                        position: 'absolute',
                        color: 'grey',
                        right: '40px',
                        top: '10px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                    }}
                    onClick={() => {
                        setState((prevState) => ({
                            ...prevState,
                            areSettingsOpen: true,
                        }));
                    }}
                >
                    <SettingsIcon />
                </IconButton>
                {/*<FoldersTable dialogClose = {() => {updateFolderManagerOpen(false)}} socket={socket} selectPath={updateSelectedPath} loadDirectoryOnStart={selectedPath} />*/}
                <DialogTitle
                    id="FileManager-DialogTitle"
                    className={classes.scrollBarHide}
                    style={{
                        textAlign: 'center',
                        minHeight: '15vh',
                        overflowY: 'visible',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                    }}
                >
                    <div>Select directory</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className={classes.navigation}>
                            <Toolbar
                                setHiddenSearch={() => {
                                    isHiddenSearchOn.current = !isHiddenSearchOn.current;
                                    if (isHiddenSearchOn.current) {
                                        renderForceFoo(-1);
                                        rerenderSelf((ps) => !ps);
                                    }
                                }}
                                sortMethodNumber={state.sortMethodNumber}
                                changeSortMethodNumber={changeSortMethodNumber}
                                filesDisplaySize={state.filesDisplaySize}
                                changeFilesDisplaySize={changeFilesDisplaySize}
                            />
                        </div>
                        <MainToolbar
                            currentRootDirectory={state.currentRootPath}
                            setRootDirectory={(newRootPath: string) => {
                                setState((pvState) => ({
                                    ...pvState,
                                    currentRootPath: newRootPath,
                                }));
                            }}
                            currentPath={state.currentPath}
                            loadDirectory={loadDirectory}
                        />
                    </div>
                </DialogTitle>
                <DialogContent
                    id="FileManager-DialogContent"
                    classes={{ root: classes.dialogRoot }}
                    style={{
                        overflowX: 'hidden',
                        paddingLeft: 5,
                        paddingRight: 5,
                        display: 'flex',
                        minHeight: '69vh',
                        maxHeight: '69vh',
                    }}
                >
                    <div
                        className={classes.scrollBarHide}
                        style={{
                            overflow: 'scroll',
                            scrollbarWidth: 'thin',
                            minWidth: '13vw',
                            maxWidth: '13vw',
                        }}
                    >
                        <FoldersTree
                            showLoadingCircular={() => {
                                showLoadingCircular(true);
                            }}
                            currentPath={state.currentPath}
                            joinDirectory={loadDirectory}
                            currentRootDirectory={state.currentRootPath}
                        />
                    </div>
                    <div
                        className={classes.scrollBarHide}
                        style={{
                            borderLeft: 'solid 1px #a0a9ad4d',
                            borderRight: 'solid 1px #a0a9ad4d',
                            overflow: 'scroll',
                            minWidth: '49vw',
                            maxWidth: '62vw',
                            scrollbarWidth: 'thin',
                        }}
                    >
                        {state.managerError ? (
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ color: 'red', fontSize: '25px' }}>
                                    <b>Error</b>
                                </span>{' '}
                                <br />
                                Error message: <b>{state.managerError.message}</b> <br />
                                Error code: <b>{state.managerError.code}</b> <br />
                                Error number: <b>{state.managerError.number}</b>
                            </div>
                        ) : null}
                        <div id="FileManager-RenderedFiles">
                            {renderLimesArray.map((i, ac) => {
                                if (i > state.files.length) return null;
                                return (
                                    <RenderFiles
                                        acceptableFileTypes={state.acceptableFileTypes}
                                        filesDisplaySize={state.filesDisplaySize}
                                        key={`filesBlock-${i}-${ac}`}
                                        onFileKeyDown={onKeyDownOnFile}
                                        saveRefs={isHiddenSearchOn.current}
                                        setFilesRefs={setFilesRefs}
                                        renderFilesLimit={renderFilesLimit}
                                        startIndex={i}
                                        showDeleteFileFromSelectedFilesButton={showDeleteFileFromSelectedFilesButton}
                                        mouseOverPath={state.mouseOverPath}
                                        files={state.files.slice(i, i + renderFilesLimit)}
                                        selectedFiles={state.selectedFiles}
                                        onFileClick={onFileClick}
                                        renderForce={showFilesRenderForce.current[ac]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div
                        id="FileManager-SelectedFiles"
                        className={classes.scrollBarHide}
                        style={{
                            overflow: 'scroll',
                            scrollbarWidth: 'thin',
                            minWidth: '13vw',
                            maxWidth: '13vw',
                        }}
                    >
                        <SelectedFiles loadDirectory={loadDirectory} selectedFiles={state.selectedFiles} />
                    </div>
                    <Snackbar
                        open={errorSnackbarMessage ? true : false}
                        autoHideDuration={2000}
                        onClose={() => {
                            setErrorSnackbarMessage('');
                        }}
                    >
                        {/*<Alert
                            onClose={() => {
                                setErrorSnackbarMessage('');
                            }}
                            severity="error"
                        >
                            {errorSnackbarMessage}
                        </Alert>*/}
                    </Snackbar>
                </DialogContent>
                <DialogActions
                    style={{
                        justifyContent: 'center',
                        overflowY: 'visible',
                        display: 'flex',
                        minHeight: '3vh',
                        maxHeight: '3vh',
                    }}
                >
                    <div
                        style={{
                            alignContent: 'center',
                            textAlign: 'center',
                            overflowY: 'visible',
                            overflowX: 'hidden',
                            scrollbarWidth: 'none',
                        }}
                    >
                        <Button
                            disabled={state.selectedFiles.size < minNumberOfSelectedFiles}
                            onClick={() => {
                                selectFiles([...state.selectedFiles.values()]);
                                dialogClose();
                            }}
                        >
                            Select <b>{state.selectedFiles.size}</b> files
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FileManager;