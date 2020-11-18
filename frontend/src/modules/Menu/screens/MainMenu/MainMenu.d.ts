export interface MainMenuProps {
    open: boolean;
    handleClose: () => any;
    isAnyProjectOpen: boolean;
    deafultSelectedSector?: string;
}

export interface OptionsContentProps {
    optionName: string;
    selectOption: Function;
}
