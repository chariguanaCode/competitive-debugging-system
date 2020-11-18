import { TaskState } from 'reduxState/models';
import { TestsSortingModel } from '../../Tasks.d';

export interface TestsListPropsModel {
    searchText: string;
    testStateFilter: Set<TaskState>;
    sorting: TestsSortingModel;
}

export interface TestsListStateModel {}
