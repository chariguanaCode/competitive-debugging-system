import React, { memo, useState } from 'react';
import { Folder as FolderIcon } from '@material-ui/icons';
import { MenuItem, MenuList, TextField, Button, IconButton, InputAdornment } from '@material-ui/core';
import { OptionsContentProps } from './Types';
import FileManager from '../FileManager/FileManagerWithConfig'
const CreateProject: React.FunctionComponent = memo(() => {

    const defaultFileManagerConfig = {
        isOpen: false,
        maxNumberOfSelectedFiles: 1,
        onSelectFiles: () => {},
    };
    const [fileManagerConfig, changeFileManagerConfig] = useState<{
        isOpen: boolean;
        maxNumberOfFiles: number;
        onSelectFiles: Function;
        availableFilesTypes?: Array<string> | undefined;
        acceptableFileTypes?: Array<string> | undefined;
    }>(defaultFileManagerConfig);

    const createProject = (files?: Array<string>) => {};

    const createProjectFromOneFile = () => {
        changeFileManagerConfig({
            maxNumberOfFiles: 1,
            onSelectFiles: createProject,
            isOpen: true,
            acceptableFileTypes: ['.cpp'],
            availableFilesTypes: ['DIRECTORY', '.cpp'],
        });
    };

    const createProjectFromManyFiles = () => {
        changeFileManagerConfig({
            maxNumberOfFiles: Infinity,
            onSelectFiles: createProject,
            isOpen: true,
            acceptableFileTypes: ['.cpp'],
            availableFilesTypes: ['DIRECTORY', '.cpp'],
        });
    };

    return (
        <>
            <MenuList>
                <MenuItem
                    onClick={() => {
                        createProjectFromOneFile();
                    }}
                >
                    New project from one .cpp file
                </MenuItem>
                <MenuItem
                    onClick={() => {
                    }}
                >
                    New empty project
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        createProjectFromManyFiles();
                    }}
                >
                    New project from many .cpp files
                </MenuItem>
            </MenuList>
            <FileManager selectFiles = {fileManagerConfig.onSelectFiles/>
        </>
    );
});

export const OptionsContent: React.FunctionComponent<OptionsContentProps> = ({ optionName, selectOption }) => {
    switch (optionName) {
        case 'Create Project':
            return <CreateProject />;
        case 'Save As':
            return (
                <>
                    <form style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ paddingBottom: '6px', fontSize: '24px' }}>Save as</div>
                        <TextField label="Project name" />
                        <TextField
                            label="Project location"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <FolderIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button style={{ padding: '3px', marginTop: '2px' }}>Confirm</Button>
                        <div style={{ paddingTop: '6px', paddingBottom: '5px', fontSize: '18px', opacity: 0.7 }}>Optional</div>
                        <TextField
                            label="Project description"
                            placeholder="nlogn solve testing"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField label="Project author" />
                    </form>
                </>
            );
        case 'Open Project':
            return (
                <>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                selectOption('openproject');
                            }}
                        >
                            Open project
                        </MenuItem>
                    </MenuList>
                </>
            );
        default:
            return <></>;
    }
};

export default OptionsContent;
