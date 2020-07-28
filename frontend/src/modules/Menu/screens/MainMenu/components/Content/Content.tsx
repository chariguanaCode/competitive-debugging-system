import React, { useState, memo } from 'react';
import useStyles from './Content.css';
import * as Contents from '../Contents';
import { ContentProps, FileManagerConfig } from './Types';
import { Sector } from '../SectorsButtons';
import FileManager from 'modules/FileManager/fileManager';

export const Content: React.FunctionComponent<ContentProps> = memo(({ selectedSector, closeMainMenu }) => {
    const classes = useStyles();
    const defaultFileManagerConfig = {
        isOpen: false,
        maxNumberOfFiles: 1,
        onSelectFiles: () => {},
    };
    const [fileManagerConfig, setFileManagerConfig] = useState<FileManagerConfig>(defaultFileManagerConfig);
    /* @ts-ignore TODO: FIX TS*/
    const SectorContent = !!Contents[Sector[selectedSector]] ? Contents[Sector[selectedSector]] : null;
    return (
        <div className={classes.Content}>
            {SectorContent && <SectorContent setFileManagerConfig={setFileManagerConfig} closeMainMenu={closeMainMenu} />}
            {fileManagerConfig.isOpen ? (
                <FileManager
                    maxNumberOfSelectedFiles={fileManagerConfig.maxNumberOfFiles}
                    selectFiles={fileManagerConfig.onSelectFiles}
                    loadDirectoryOnStart={'/'}
                    isFileManagerOpen={fileManagerConfig.isOpen}
                    dialogClose={() => {
                        setFileManagerConfig(defaultFileManagerConfig);
                    }}
                    availableFilesTypes={fileManagerConfig.availableFilesTypes}
                    acceptableFileTypes={fileManagerConfig.acceptableFileTypes}
                />
            ) : null}
        </div>
    );
});

export default Content;