export interface GroupListElementPropsModel {
    clickRemoveButton?: () => any;
    clickEditButton?: () => any;
    clickExpandGroupButton: () => void;
    setCheckboxValue: (newValue: boolean) => void;
    isExpanded: boolean;
    groupObject: {
        name: string;
        id: string;
        testsAmount: number;
    };
    isSelected: boolean;
}

export interface GroupListElementStateModel {}
