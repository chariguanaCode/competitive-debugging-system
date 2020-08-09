import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { createAction, Action } from 'redux-actions';
import { Watchblock, Watch } from '../models';
import { useAllTasksState } from 'reduxState/selectors';

export enum TaskStateAction {
    SET_CURRENT_TASK_ID = 'SET_CURRENT_TASK_ID',
    SET_CURRENT_TASK_STDOUT = 'SET_CURRENT_TASK_STDOUT',
    SET_CURRENT_TASK_STDOUT_SIZE = 'SET_CURRENT_TASK_STDOUT_SIZE',
    SET_CURRENT_TASK_WATCHBLOCKS = 'SET_CURRENT_TASK_WATCHBLOCKS',
    SET_CURRENT_TASK_WATCHBLOCKS_CHILDREN = 'SET_CURRENT_TASK_WATCHBLOCKS_CHILDREN',
    SET_CURRENT_TASK_WATCHBLOCKS_SIZE = 'SET_CURRENT_TASK_WATCHBLOCKS_SIZE',
    RELOAD_TASKS = 'RELOAD_TASKS',
}

const actions = {
    setCurrentTaskId: createAction<number>(TaskStateAction.SET_CURRENT_TASK_ID),
    setCurrentTaskStdout: createAction<string>(TaskStateAction.SET_CURRENT_TASK_STDOUT),
    setCurrentTaskStdoutSize: createAction<number>(TaskStateAction.SET_CURRENT_TASK_STDOUT_SIZE),
    setCurrentTaskWatchblocks: createAction<Watchblock>(TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS),
    setCurrentTaskWatchblocksChildren: createAction<Array<Watchblock | Watch>>(
        TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS_CHILDREN
    ),
    setCurrentTaskWatchblocksSize: createAction<number>(TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS_SIZE),
    reloadTasks: createAction(TaskStateAction.RELOAD_TASKS, () => null),
};

export type TaskStateActionPayload = typeof actions[keyof typeof actions] extends (...args: any[]) => Action<infer R>
    ? R
    : never;

export const useTaskStatesActions = () => {
    const dispatch = useDispatch();
    const taskStates = useAllTasksState();

    return useMemo(() => {
        const boundActions = bindActionCreators(actions as any, dispatch) as typeof actions;

        const reloadTasks = () => {
            if (taskStates.timeout === null) {
                taskStates.shouldReload = false;
                taskStates.timeout = setTimeout(() => {
                    taskStates.timeout = null;
                    if (taskStates.shouldReload) {
                        reloadTasks();
                    }
                }, 500);
                boundActions.reloadTasks();
            } else {
                taskStates.shouldReload = true;
            }
        };

        return {
            ...boundActions,
            reloadTasks,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
};
