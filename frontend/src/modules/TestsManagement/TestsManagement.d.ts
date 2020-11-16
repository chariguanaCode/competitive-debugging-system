import { AnchoredDialogPropsModel } from 'components/AnchoredDialog/AnchoredDialog.d';

export interface TestsManagementPropsModel {}

export interface TestsManagementStateModel {
    tasksAdditionDialogVisibility: boolean;
    searchText: string;
    editionDialogProps: AnchoredDialogPropsModel;
    groupEditionDialogProps: AnchoredDialogPropsModel;
}
