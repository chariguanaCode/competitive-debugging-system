import { handleActions } from 'redux-actions';
import { TaskStateAction, TaskStateActionPayload } from '../actions';
import { TaskStateModel, AllTasksModel, Watchblock, Watch } from '../models';

export const taskStateReducer = handleActions<TaskStateModel, TaskStateActionPayload>(
    {
        [TaskStateAction.RELOAD_TASKS]: (state, action) => {
            return { ...state, reloadAllTasks: state.reloadAllTasks + 1 };
        },
        [TaskStateAction.SET_CURRENT_TASK_ID]: (state, action) => ({
            ...state,
            currentTask: {
                id: (action.payload as { id: string; groupId: string }).id,
                groupId: (action.payload as { id: string; groupId: string }).groupId,
                stdout: '',
                stdoutFileSize: 0,
                watchblocks: { children: [] as Array<Watchblock | Watch> } as Watchblock,
                watchblockFileSize: 0,
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_STDOUT]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                stdout: action.payload as string,
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_STDOUT_SIZE]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                stdoutFileSize: action.payload as number,
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                watchblocks: action.payload as Watchblock,
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS_CHILDREN]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                watchblocks: {
                    ...state.currentTask.watchblocks,
                    children: action.payload as Array<Watchblock | Watch>,
                },
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS_SIZE]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                watchblockFileSize: action.payload as number,
            },
        }),
    },
    {
        allTasks: {
            current: {} as AllTasksModel,
            timeout: null,
            shouldReload: false,
        },
        reloadAllTasks: 0,
        currentTask: {
            id: '-1',
            groupId: '-1',
            stdout: '',
            stdoutFileSize: 0,
            watchblocks: { children: [] as Array<Watchblock | Watch> } as Watchblock,
            watchblockFileSize: 0,
        },
    }
);

export default taskStateReducer;
