import { TaskState, TestModel } from 'reduxState/models';

export interface TestListElementPropsModel {
    testObject: TestModel & { id: string; executionTime: string; state: TaskState };
}

export interface TestListElementStateModel {}
