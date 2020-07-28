import React, { useState, useRef, useEffect } from 'react';
import useStyles from './FileManager.css';
import { FileManagerPropsModel, FileManagerStateModel, FileModel } from './FileManager.d';
import { Layout, Model, TabNode } from 'flexlayout-react';
import { Header, Files, Footer, DirectoryTree, SelectedList } from './screens';
import { loadFilesOnDirectory } from 'backend/filesHandlingFunctions';
import { comparatorForFilesSort } from './utils/tools';
import { stringify } from 'querystring';
export const FileManager: React.FunctionComponent<FileManagerPropsModel> = ({
    maxNumberOfSelectedFiles = Infinity,
    minNumberOfSelectedFiles = 1,
    open,
    visibleFilesExtensions,
    acceptableFilesExtensions,
    selectFiles,
    directoryOnStart,
    closeFileManager,
    //config,
}) => {
    const classes = useStyles();
    const [state, setState] = useState<FileManagerStateModel>({
        files: [],
        currentPath: '',
        currentRootPath: '/',
        managerError: null,
        selectedFiles: new Set(),
        visibleFilesExtensions: visibleFilesExtensions ? visibleFilesExtensions : [],
        acceptableFilesExtensions: acceptableFilesExtensions ? new Set(acceptableFilesExtensions) : undefined,
        sortMethodNumber: 0,
        areSettingsOpen: false,
    });

    useEffect(() => {
        loadDirectory({ path: directoryOnStart });
    }, [directoryOnStart]);

    useEffect(() => {
        console.log(state.files);
        setState((pvState) => ({
            ...pvState,
            files: Array.from(pvState.files).sort(comparatorForFilesSortProvider),
        }));
    }, [state.sortMethodNumber]);
    console.log(state.files);
    const loadDirectory = async ({ path, regex }: { path: string; regex?: string }) => {
        //setLoadingState(true);
        //showLoadingCircular(true);
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
            currentPath: newPath,
            managerError: files.length
                ? null
                : {
                      message: 'No files found',
                      code: '404',
                      number: '404',
                  },
            files: files,
            currentRootPath: newPath.split('/')[0],
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
            <div
                className={classes.FileManager}
                style={{
                    backgroundColor: '#424242',
                    position: 'relative',
                    width: '1000px',
                    height: '1000px',
                    top: '10px',
                    left: '10px',
                }}
            >
                <Header
                    currentPath={state.currentPath}
                    loadDirectory={loadDirectory}
                    currentRootDirectory={state.currentRootPath}
                    setRootDirectory={(newValue: string) => setStateValue('currentRootPath', newValue)}
                />
                <Files
                    files={state.files}
                    selectedFiles={state.selectedFiles}
                    acceptableFilesExtensions={state.acceptableFilesExtensions}
                    setSelectedFiles={(newSelectedFiles) => setStateValue('selectedFiles', newSelectedFiles)}
                    maxNumberOfSelectedFiles={maxNumberOfSelectedFiles}
                    loadDirectory={loadDirectory}
                />
                <Footer />
            </div>
        </>
    );
};
// <Layout model={model} factory={factory} onModelChange={setModel} ref={layout} />
export default FileManager;
