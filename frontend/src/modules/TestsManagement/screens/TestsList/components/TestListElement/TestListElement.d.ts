import { TestGroupsModel, TestModel } from 'reduxState/models';

export interface TestListElementPropsModel {
    clickRemoveButton: (e: any) => void;
    clickEditButton: (e: any) => any;
    setCheckboxValue: (checked: boolean) => any;
    testObject: TestModel & { id: string };
    isSelected: boolean;
}

export interface TestListElementStateModel {}
