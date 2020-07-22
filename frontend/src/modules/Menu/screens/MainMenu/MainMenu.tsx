import React from 'react';
import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Fade, IconButton, Button, Collapse, Paper, MenuList, MenuItem } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import InfoIcon from '@material-ui/icons/Info';
import CreateIcon from '@material-ui/icons/Create';
import NoteIcon from '@material-ui/icons/Note';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import PrintIcon from '@material-ui/icons/Print';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import FolderIcon from '@material-ui/icons/Folder';
import { FileManager } from '../FileManager/fileManager';
import { TextField, FormLabel, InputAdornment } from '@material-ui/core';
import { makeStyles, useTheme, ThemeProvider } from '@material-ui/core/styles';
import { useLoadProject } from 'backend/projectManagement';
import { FileType } from '../FileManager/fileManager';

interface Props {
    open: boolean;
    handleClose: Function;
    isAnyProjectOpen?: boolean;
    socket?: any;
}

interface optionsButtonTypes {
    name: string;
    icon: JSX.Element;
    doesNeedOpenProject: boolean;
}

const Buttons: Array<optionsButtonTypes> = [
    {
        name: 'Create Project',
        icon: <NoteIcon style={{ color: '#64b5f6' }} />,
        doesNeedOpenProject: false,
    },
    {
        name: 'Open Project',
        icon: <FolderOpenIcon style={{ color: '#ffeb3b' }} />,
        doesNeedOpenProject: false,
    },
    {
        name: 'Recent Projects',
        icon: <AllInboxIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: false,
    },
    {
        name: 'Save As',
        icon: <SaveAltIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
    },
    {
        name: 'Save',
        icon: <SaveIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
    },
    {
        name: 'Information',
        icon: <InfoIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
    },
    {
        name: 'Export',
        icon: <ImportExportIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
    },
    {
        name: 'Print',
        icon: <PrintIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
    },
];

const useStyles = makeStyles((theme) => ({
    mainMenu: {
        position: 'absolute',
        left: '0px',
        top: (props: any) => (props.open ? '80px' : '-400px'),
        transition: 'top 0.43s',
        zIndex: 1201,
        display: (props: any) => (props.open ? 'flex' : 'flex'),
        minWidth: '800px',
        minHeight: '400px',
        border: 'solid 1px #a0a9ad4d',
        backgroundColor: theme.palette.mainMenu.backgroundColor,
        flexDirection: 'row',
        //transitionTimingFunction: "cubic-bezier(3,4,5,6)",
        color: theme.palette.mainMenu.fontColor,
        '.mainMenu-optionIcon': {
            color: 'red',
        },
    },
    menuItem: {
        margin: '3px',
        height: '50px',
        width: '200px',
    },
    mainMenuOptionsList: {
        borderRight: 'solid 1px #a0a9ad4d',
    },
}));
interface OptionsInfoTypes {
    optionName: string;
    selectOption: Function;
}

const OptionsInfo: React.FunctionComponent<OptionsInfoTypes> = ({ optionName, selectOption }) => {
    switch (optionName) {
        case 'Create Project':
            return (
                <>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                selectOption('onecpp');
                            }}
                        >
                            {' '}
                            New project from one .cpp file{' '}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                selectOption('empty');
                            }}
                        >
                            {' '}
                            New empty project{' '}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                selectOption('manycpp');
                            }}
                        >
                            {' '}
                            New project from many .cpp files{' '}
                        </MenuItem>
                    </MenuList>
                </>
            );
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
    return <></>;
};

export const MainMenu: React.FunctionComponent<Props> = ({ open, handleClose, isAnyProjectOpen, socket }) => {
    const [optionInfo, setOptionInfo] = useState<string>(Buttons[0].name);
    const defaultFileManagerConfig = {
        isOpen: false,
        maxNumberOfFiles: 1,
        onSelectFiles: () => {},
    };
    const [fileManagerConfig, changeFileManagerConfig] = useState<{
        isOpen: boolean;
        maxNumberOfFiles: Number;
        onSelectFiles: Function;
        availableFilesTypes?: Array<string> | undefined;
        acceptableFileTypes?: Array<string> | undefined;
    }>(defaultFileManagerConfig);

    const createProject = (files?: Array<string>) => {
        if (socket) {
            socket.send(
                JSON.stringify({
                    type: 'createNewProject',
                    data: {
                        name: 'Pies',
                        path: '/cds',
                        description: 'My first solve',
                        author: 'Jozek Kowalski',
                    },
                })
            );
        } else console.log('connection error');
    };

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

    /********************************
     *          OPEN PROJECT          *
     ********************************/

    const LoadProject = useLoadProject();

    const SelectPathToOpenProject = (selectedFiles: Array<FileType>) => {
        if (selectedFiles.length) LoadProject(selectedFiles[0].path);
    };

    const OpenProject = () => {
        changeFileManagerConfig({
            maxNumberOfFiles: Infinity,
            onSelectFiles: SelectPathToOpenProject,
            isOpen: true,
            availableFilesTypes: ['DIRECTORY', '.cdsp'],
            acceptableFileTypes: ['.cdsp'],
        });
    };

    const optionsFunctionsGroups = {
        'Create Project': (option: string) => {
            switch (option) {
                case 'onecpp':
                    createProjectFromOneFile();
                    return;
                case 'manycpp':
                    createProjectFromManyFiles();
                    return;
                case 'empty':
                    createProject();
                    return;
                default:
                    return;
            }
        },
        'Open Project': (option: string) => {
            switch (option) {
                case 'openproject':
                    OpenProject();
                    return;
                default:
                    return;
            }
        },
    };

    const classes = useStyles({
        open: open,
    });
    const theme = useTheme();
    //                <IconButton style = {{color: "red", right: "2px", top: "2px", position: "absolute", padding: "0px"}} onClick = { ()=>{handleClose()} }><CloseIcon/></IconButton>
    //style = {{display: "flex", border: "solid 1px", left: "60px", position: "relative", zIndex: 1201, top: "65px", minWidth: "800px", minHeight: "400px", backgroundColor: "white", flexDirection: "row"}}
    return useMemo(
        () => (
            <>
                <div className={classes.mainMenu}>
                    <MenuList className={classes.mainMenuOptionsList}>
                        {Buttons.map((obj, index) => {
                            return (
                                <MenuItem
                                    key={`MainMenuOption-${index}`}
                                    disabled={obj.doesNeedOpenProject && !isAnyProjectOpen}
                                    onClick={() => {
                                        setOptionInfo(obj.name);
                                    }}
                                    className={classes.menuItem}
                                    style={{
                                        backgroundColor:
                                            obj.name === optionInfo
                                                ? theme.palette.mainMenu.selectedButtonBackgroundColor
                                                : 'transparent',
                                    }}
                                >
                                    {React.cloneElement(obj.icon, {
                                        style: { color: theme.palette.mainMenu.iconColorEnabled },
                                    })}
                                    <span style={{ paddingLeft: '10px' }}>{obj.name}</span>
                                </MenuItem>
                            );
                        })}
                    </MenuList>
                    <Fade in={optionInfo ? true : false} timeout={2000}>
                        <div style={{ color: theme.palette.mainMenu.fontColor, padding: '20px' }}>
                            {/*
                        //@ts-ignore */}
                            <OptionsInfo optionName={optionInfo} selectOption={optionsFunctionsGroups[optionInfo]} />
                        </div>
                    </Fade>
                </div>
                {fileManagerConfig.isOpen ? (
                    <FileManager
                        maxNumberOfSelectedFiles={fileManagerConfig.maxNumberOfFiles}
                        selectFiles={fileManagerConfig.onSelectFiles}
                        loadDirectoryOnStart={'/'}
                        isFileManagerOpen={fileManagerConfig.isOpen}
                        dialogClose={() => {
                            changeFileManagerConfig(defaultFileManagerConfig);
                        }}
                        availableFilesTypes={fileManagerConfig.availableFilesTypes}
                        acceptableFileTypes={fileManagerConfig.acceptableFileTypes}
                    />
                ) : null}
            </>
        ),
        [optionInfo, fileManagerConfig, open, isAnyProjectOpen, theme, classes]
    );
};

export default MainMenu;
