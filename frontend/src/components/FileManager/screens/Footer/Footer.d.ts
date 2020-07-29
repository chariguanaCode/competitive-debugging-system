export interface FooterPropsModel {
    minNumberOfSelectedFiles: number;
    selectedFiles: Set<string>;
    selectFiles: (arg1: Array<string>) => any;
    dialogClose: () => any;
}

export interface FooterStateModel {}
