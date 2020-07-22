export interface MainMenuProps {
    open: boolean;
    handleClose: Function;
    isAnyProjectOpen?: boolean;
    socket?: any;
}

export interface OptionsContentProps {
    optionName: string;
    selectOption: Function;
}
