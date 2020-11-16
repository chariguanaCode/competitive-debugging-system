import { AnchoredDialogPropsModel } from 'components/AnchoredDialog/AnchoredDialog.d';

export interface ToolbarPropsModel {
    clickAddTestsButton: () => void;
    clickRemoveTestsButton: () => void;
    clickMoveTestsButton: (destinationGroupId: string) => void;
    searchText: string;
    setSearchText: (newSearchText: string) => void;
    areButtonsForSelectedTestsDisabled: boolean;
}

export interface ToolbarStateModel {
    moveTestsDialogProps: AnchoredDialogPropsModel;
}
