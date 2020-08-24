import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useStyles from './FileManager.css';
import { FileManagerPropsModel, FileManagerStateModel, FileModel, Path } from './FileManager.d';
import { Header, Footer, Content } from './screens';
import { loadFilesOnDirectory } from 'backend/filesHandlingFunctions';
import { comparatorForFilesSort } from './utils/tools';
import { Button, Dialog, DialogContent, Slider } from '@material-ui/core';
import { parsePath } from 'utils/tools';

export const FileManager: React.FunctionComponent<FileManagerPropsModel> = ({
    maxNumberOfSelectedFiles = Infinity,
    minNumberOfSelectedFiles = 1,
    open,
    visibleFilesExtensions,
    acceptableFilesExtensions,
    selectFiles = () => {},
    directoryOnStart = '/',
    closeFileManager = () => {},
    withFilesStats = false,
    //config,
}) => {
    // TODO: add loading circular to file manager
    // TODO: add selection to file manager
    const classes = useStyles();
    const [state, setState] = useState<FileManagerStateModel>({
        files: [],
        currentPath: '/',
        managerError: null,
        selectedFiles: new Map(),
        visibleFilesExtensions: visibleFilesExtensions ? visibleFilesExtensions : [],
        acceptableFilesExtensions: acceptableFilesExtensions ? new Set(acceptableFilesExtensions) : undefined,
        sortMethodNumber: 0,
        areSettingsOpen: false,
        searchText: '',
        zoomFactor: 1, //min: 0.5 max 3 step 0.1
    });
    // TODO: zoom

    useEffect(() => {
        loadDirectory({ path: directoryOnStart });
    }, [directoryOnStart]);

    useEffect(() => {
        setState((pvState) => ({
            ...pvState,
            files: Array.from(pvState.files).sort(comparatorForFilesSortProvider),
        }));
    }, [state.sortMethodNumber]);

    const loadDirectory = async ({ path, regex }: { path: string; regex?: string }) => {
        //setLoadingState(true);
        //showLoadingCircular(true);
        path = parsePath(path);
        let [files, newPath, err] = await loadFilesOnDirectory({
            directory: path,
            regex: regex ? regex : null,
            filesExtensions: state.visibleFilesExtensions,
        });
        //if (previousHiddenSearch.current) previousHiddenSearch.current.style.backgroundColor = 'transparent';
        files.sort(comparatorForFilesSortProvider);
        //showLoadingCircular(false);
        //setLoadingState(false);
        setState((prevState) => ({
            ...prevState,
            currentPath: parsePath(newPath),
            managerError: files.length
                ? null
                : {
                      message: 'No files found',
                      code: '404',
                      number: '404',
                  },
            files: files,
        }));
    };

    const comparatorForFilesSortProvider = (obj1: FileModel, obj2: FileModel) =>
        comparatorForFilesSort(state.sortMethodNumber, obj1, obj2);

    let setStateValue = (key: string, newValue: any) =>
        setState((prevState) => ({
            ...prevState,
            [key]: newValue,
        }));

    return (
        <>
            <Dialog
                classes={{
                    paper: classes.MuiDialogPaper,
                }}
                open={!!open}
                maxWidth={'xl'}
            >
                <div className={classes.FileManager}>
                    <div className={classes.HeaderContainer}>
                        <Header
                            dialogClose={closeFileManager}
                            currentPath={state.currentPath}
                            loadDirectory={loadDirectory}
                            setSearchText={(newValue: string) => setStateValue('searchText', newValue)}
                            setRootDirectory={(newValue: string) => setStateValue('currentRootPath', newValue)}
                            sortMethodNumber={state.sortMethodNumber}
                            setSortMethodNumber={(newValue: number) => setStateValue('sortMethodNumber', newValue)}
                        />
                    </div>
                    <div className={classes.ContentContainer}>
                        <Content
                            files={state.files}
                            searchText={state.searchText}
                            selectedFiles={state.selectedFiles}
                            acceptableFilesExtensions={state.acceptableFilesExtensions}
                            setSelectedFiles={(newSelectedFiles: Map<string, FileModel>) =>
                                setStateValue('selectedFiles', newSelectedFiles)
                            }
                            maxNumberOfSelectedFiles={maxNumberOfSelectedFiles}
                            loadDirectory={loadDirectory}
                            currentPath={state.currentPath}
                            zoomFactor={state.zoomFactor}
                        />
                    </div>
                    <div className={classes.FooterContainer}>
                        <Footer
                            selectFiles={selectFiles}
                            dialogClose={closeFileManager}
                            selectedFiles={state.selectedFiles}
                            withFilesStats={withFilesStats}
                            minNumberOfSelectedFiles={minNumberOfSelectedFiles}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
export default FileManager;
