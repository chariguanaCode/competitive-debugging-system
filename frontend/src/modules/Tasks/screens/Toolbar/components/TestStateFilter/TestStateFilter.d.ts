import { TaskState } from 'reduxState/models';

export interface TestStateFilterPropsModel {
    filter: Set<TaskState>;
    setFilter: (newValue: React.SetStateAction<Set<TaskState>>) => void;
}

export interface TestStateFilterStateModel {}
