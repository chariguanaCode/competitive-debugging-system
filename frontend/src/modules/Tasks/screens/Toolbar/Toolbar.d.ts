import { TestsSortingModel } from '../../Tasks.d';

export interface ToolbarPropsModel {
    searchText: string;
    setSearchText: (newValue: string) => void;
    testStateFilter: Set<TaskState>;
    setTestStateFilter: (newValue: React.SetStateAction<Set<TaskState>>) => void;
    sorting: TestsSortingModel;
    setSorting: (newValue: React.SetStateAction<TestsSortingModel>) => void;
}
