import { SectorButton } from 'modules/Menu/screens/MainMenu/components/SectorsButtons/SectorButtons';

export interface MenuPropsModel {
    sectors: Array<string>;
    contents: { [key: string]: React.ElementType };
    buttons: Array<SectorButton>;
    contentsProps?: Iterable;
    contentProps?: { [key: string]: Iterable };
}

export interface MenuStateModel {}

export interface SectorButton {
    name: string;
    icon: JSX.Element;
    disabled?: boolean;
    key: string;
}
