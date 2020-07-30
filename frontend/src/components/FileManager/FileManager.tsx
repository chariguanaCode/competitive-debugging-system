import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useStyles from './FileManager.css';
import { FileManagerPropsModel, FileManagerStateModel, FileModel, Path } from './FileManager.d';
import { Header, Footer, Content } from './screens';
import { loadFilesOnDirectory } from 'backend/filesHandlingFunctions';
import { comparatorForFilesSort } from './utils/tools';
import { Button, Dialog, DialogContent } from '@material-ui/core';
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
    //config,
}) => {
    // TODO: add loading circular to file manager
    // TODO: add selection to file manager
    const classes = useStyles();
    const [state, setState] = useState<FileManagerStateModel>({
        files: [],
        currentPath: '/',
        managerError: null,
        selectedFiles: new Set(),
        visibleFilesExtensions: visibleFilesExtensions ? visibleFilesExtensions : [],
        acceptableFilesExtensions: acceptableFilesExtensions ? new Set(acceptableFilesExtensions) : undefined,
        sortMethodNumber: 0,
        areSettingsOpen: false,
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
        let [files, newPath] = await loadFilesOnDirectory({
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
            <Dialog open={!!open} maxWidth={'xl'}>
                <div className={classes.FileManager}>
                    <div className={classes.HeaderContainer}>
                        <Header
                            dialogClose={closeFileManager}
                            currentPath={state.currentPath}
                            loadDirectory={loadDirectory}
                            setRootDirectory={(newValue: string) => setStateValue('currentRootPath', newValue)}
                            sortMethodNumber={state.sortMethodNumber}
                            setSortMethodNumber={(newValue: number) => setStateValue('sortMethodNumber', newValue)}
                        />
                    </div>
                    <div className={classes.ContentContainer}>
                        <Content
                            files={state.files}
                            selectedFiles={state.selectedFiles}
                            acceptableFilesExtensions={state.acceptableFilesExtensions}
                            setSelectedFiles={(newSelectedFiles: Set<string>) =>
                                setStateValue('selectedFiles', newSelectedFiles)
                            }
                            maxNumberOfSelectedFiles={maxNumberOfSelectedFiles}
                            loadDirectory={loadDirectory}
                            currentPath={state.currentPath}
                        />
                    </div>
                    <div className={classes.FooterContainer}>
                        <Footer
                            selectFiles={selectFiles}
                            dialogClose={closeFileManager}
                            selectedFiles={state.selectedFiles}
                            minNumberOfSelectedFiles={minNumberOfSelectedFiles}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
// <Layout model={model} factory={factory} onModelChange={setModel} ref={layout} />
export default FileManager;
