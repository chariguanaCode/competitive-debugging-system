import { useSelector } from 'react-redux';
import { RootState } from '../';

export const useAllTasksState = () => {
    return useSelector(
        (state: RootState) => state.taskStates.allTasks,
        (prev, curr) => prev.reload === curr.reload
    );
};

export const useCurrentTaskState = () => {
    return useSelector((state: RootState) => state.taskStates.currentTask);
};
