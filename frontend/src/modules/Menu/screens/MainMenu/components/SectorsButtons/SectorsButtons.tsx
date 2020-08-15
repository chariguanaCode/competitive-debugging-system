import React from 'react';
import { SectorButton } from './SectorButtons.d';
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
    CreateProject,
    OpenProject,
    RecentProjects,
    SaveAs,
    Save,
    Information,
    Export,
    Print,
}

const SectorsButtons: Array<SectorButton> = [
    {
        name: 'Create Project',
        icon: <NoteIcon style={{ color: '#64b5f6' }} />,
        doesNeedOpenProject: false,
        sectorId: Sector.CreateProject,
    },
    {
        name: 'Open Project',
        icon: <FolderOpenIcon style={{ color: '#ffeb3b' }} />,
        doesNeedOpenProject: false,
        sectorId: Sector.OpenProject,
    },
    {
        name: 'Recent Projects',
        icon: <AllInboxIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: false,
        sectorId: Sector.RecentProjects,
    },
    {
        name: 'Save As',
        icon: <SaveAltIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        sectorId: Sector.SaveAs,
    },
    {
        name: 'Save',
        icon: <SaveIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        sectorId: Sector.Save,
        doesNeedSaveLocation: true,
    },
    {
        name: 'Information',
        icon: <InfoIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        sectorId: Sector.Information,
    },
    {
        name: 'Export',
        icon: <ImportExportIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        sectorId: Sector.Export,
        disabled: true,
    },
    {
        name: 'Print',
        icon: <PrintIcon style={{ color: 'blue' }} />,
        doesNeedOpenProject: true,
        sectorId: Sector.Print,
        disabled: true,
    },
];

export default SectorsButtons;
