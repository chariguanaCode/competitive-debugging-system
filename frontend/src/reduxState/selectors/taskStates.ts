import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useAllTasksState = () => {
    return useSelector(
        (state: RootState) => state.taskStates,
        (prev, curr) => prev.reloadAllTasks === curr.reloadAllTasks
    ).allTasks;
};

export const useAllTasksStateReload = () => {
    return useSelector((state: RootState) => state.taskStates.reloadAllTasks);
};

export const useCurrentTaskState = () => {
    return useSelector((state: RootState) => state.taskStates.currentTask);
};
