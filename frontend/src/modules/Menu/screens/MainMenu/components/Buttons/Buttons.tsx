import React from 'react';
import { OptionButton } from './Types';
import {
    AllInbox as AllInboxIcon,
    FolderOpen as FolderOpenIcon,
    ImportExport as ImportExportIcon,
    Info as InfoIcon,
    Note as NoteIcon,
    Print as PrintIcon,
    Save as SaveIcon,
    SaveAlt as SaveAltIcon,
} from '@material-ui/icons';

const Buttons: Array<OptionButton> = [
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

export default Buttons;
