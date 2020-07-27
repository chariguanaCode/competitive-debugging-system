import { Sector } from '../SectorsButtons';

export interface ContentProps {
    selectedSector: Sector;
    closeMainMenu: () => any;
}

export interface FileManagerConfig {
    isOpen: boolean;
    maxNumberOfFiles: number;
    onSelectFiles: (v: string[]) => any;
    availableFilesTypes?: Array<string> | undefined;
    acceptableFileTypes?: Array<string> | undefined;
}
