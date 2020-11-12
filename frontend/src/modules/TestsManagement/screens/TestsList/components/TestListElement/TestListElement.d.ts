import { TestGroupsModel, TestModel } from 'reduxState/models';

export interface TestListElementPropsModel {
    clickRemoveButton: () => void;
    clickEditButton?: () => any;
    clickCheckbox?: () => any;
    setCheckboxValue: (checked: boolean) => any;
    testObject: TestModel & { id: string };
    isSelected: boolean;
}

export interface TestListElementStateModel {}
