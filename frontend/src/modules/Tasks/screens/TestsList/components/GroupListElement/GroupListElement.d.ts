import { TaskState } from 'reduxState/models';

export interface GroupListElementPropsModel {
    clickExpandGroupButton: () => void;
    isExpanded: boolean;
    groupObject: {
        name: string;
        id: string;
        testsAmounts: {
            [key in TaskState]: number;
        };
        allTestsAmount: number;
    };
}

export interface GroupListElementStateModel {}
