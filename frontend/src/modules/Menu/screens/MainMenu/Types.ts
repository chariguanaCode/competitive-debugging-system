export interface MainMenuProps {
    open: boolean;
    handleClose: Function;
    isAnyProjectOpen: boolean;
}

export interface OptionsContentProps {
    optionName: string;
    selectOption: Function;
}