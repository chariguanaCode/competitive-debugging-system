import React from 'react';
import { FileManager } from 'components';
export const FileManagerContainer: React.FunctionComponent<{ useFileManager: any; useFileManagerActions: any }> = ({
    useFileManager,
    useFileManagerActions,
}) => {
    const { setFileManager } = useFileManagerActions();
    const fileManager = useFileManager();
    return (
        <>
            {fileManager.open && (
                <FileManager
                    {...fileManager}
                    closeFileManager={() => {
                        setFileManager({ open: false });
                    }}
                />
            )}
        </>
    );
};

export default FileManagerContainer;
