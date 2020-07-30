import React, { useState, useMemo, useCallback } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { ContextTypes, FileManagerProps, FileType } from './Types';
import { FileManager } from './FileManager';
import GlobalStateContext from '../../utils/GlobalStateContext';
const FileManagerContext = createContext({} as ContextTypes);

export const FileManagerProvider = ({ children }: { children: any }) => {
    const config = useContextSelector(GlobalStateContext, (v) => v.config);
    let fileManagerConfig;
    if (config) fileManagerConfig = config.settings.fileManager;

    const defaultFileManagerConfig = {
        maxNumberOfSelectedFiles: 1,
        dialogClose: () => {},
        selectFiles: () => {},
        loadDirectoryOnStart: '/',
        isFileManagerOpen: false,
    };
    const [fileManagerProps, setFileManagerProps] = useState<FileManagerProps>(defaultFileManagerConfig);

    const closeFileManager = useCallback(() => {
        fileManagerProps.dialogClose();
        setFileManagerProps(defaultFileManagerConfig);
        console.log('closed');
    }, [fileManagerProps.dialogClose]);

    const hideFileManager = useCallback(
        (files: Array<string>) => {
            fileManagerProps.selectFiles(files);
            setFileManagerProps(defaultFileManagerConfig);
            console.log('hood');
        },
        [fileManagerProps.selectFiles]
    );

    const showFileManager = useCallback(
        (props: FileManagerProps) => {
            setFileManagerProps({ ...props, isFileManagerOpen: true });
        },
        [setFileManagerProps]
    );

    return (
        <FileManagerContext.Provider
            value={{
                showFileManager,
            }}
        >
            {fileManagerProps.isFileManagerOpen && (
                <FileManager
                    {...fileManagerProps}
                    dialogClose={closeFileManager}
                    selectFiles={hideFileManager}
                    config={fileManagerProps.config || fileManagerConfig}
                />
            )}
            {children}
        </FileManagerContext.Provider>
    );
};

export default FileManagerContext;
