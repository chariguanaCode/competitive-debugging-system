import { MenuPropsModel } from '../../Menu.d';

export interface SidebarPropsModel {
    selectSector: (sectorKey: string) => any;
    selectedSector: string;
    buttons: MenuPropsModel['buttons'];
}

export interface SidebarStateModel {}
