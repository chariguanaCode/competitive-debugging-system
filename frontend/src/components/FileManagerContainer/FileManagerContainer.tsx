import React from 'react';
import { useFileManagerActions } from 'reduxState/actions';
import { useFileManager } from 'reduxState/selectors';
import { FileManager } from 'components';
export const FileManagerContainer: React.FunctionComponent = () => {
    const { setFileManager } = useFileManagerActions();
    const fileManager = useFileManager();
    return (
        <>
            {fileManager.open && <FileManager
                {...fileManager}
                closeFileManager={() => {
                    setFileManager({ open: false });
                }}
            />}
        </>
    );
};

export default FileManagerContainer;
