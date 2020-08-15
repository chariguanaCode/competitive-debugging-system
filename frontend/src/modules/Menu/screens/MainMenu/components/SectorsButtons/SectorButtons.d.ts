import { Sector } from './SectorsButtons';

export interface MainMenuSectorButton {
    name: string;
    icon: JSX.Element;
    doesNeedOpenProject: boolean;
    doesNeedSaveLocation?: boolean;
    key: Sector;
    disabled?: boolean;
}
