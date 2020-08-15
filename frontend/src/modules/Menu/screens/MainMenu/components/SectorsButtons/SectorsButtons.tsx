import React from 'react';
import { MainMenuSectorButton } from './SectorButtons.d';
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

export enum Sector {
    CreateProject = "CreateProject",
    OpenProject = "OpenProject",
    RecentProjects = "RecentProjects",
    SaveAs = "SaveAs",
    Save = "Save",
    Information = "Information",
    Export = "Export",
    Print = "Print",
}

const SectorsButtons: Array<MainMenuSectorButton> = [
    {
        name: 'Create Project',
        icon: <NoteIcon style={{ color: '#64b5f6' }} />,
        doesNeedOpenProject: false,
        key: Sector.CreateProject,
    },
    {
        name: 'Open Project',
        icon: <FolderOpenIcon style={{ color: '#ffeb3b' }} />,
        doesNeedOpenProject: false,
        key: Sector.OpenProject,
    },
    {
        name: 'Recent Projects',
        icon: <AllInboxIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: false,
        key: Sector[Sector.RecentProjects],
    },
    {
        name: 'Save As',
        icon: <SaveAltIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        key: Sector.SaveAs,
    },
    {
        name: 'Save',
        icon: <SaveIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        key: Sector.Save,
        doesNeedSaveLocation: true,
    },
    {
        name: 'Information',
        icon: <InfoIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        key: Sector.Information,
    },
    {
        name: 'Export',
        icon: <ImportExportIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        key: Sector.Export,
        disabled: true,
    },
    {
        name: 'Print',
        icon: <PrintIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        key: Sector.Print,
        disabled: true,
    },
];

export default SectorsButtons;
