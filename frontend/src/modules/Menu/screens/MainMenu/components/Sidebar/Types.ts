import { Sector } from '../SectorsButtons';
export interface SidebarProps {
    selectSector: (arg1: Sector) => any;
    selectedSector: Sector;
    isAnyProjectOpen: boolean;
}
