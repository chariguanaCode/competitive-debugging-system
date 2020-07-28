import { Sector } from './SectorsButtons';

export interface SectorButton {
    name: string;
    icon: JSX.Element;
    doesNeedOpenProject: boolean;
    sectorId: Sector;
    disabled?: boolean;
}