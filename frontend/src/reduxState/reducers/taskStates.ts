import { handleActions } from 'redux-actions';
import { TaskStateAction, TaskStateActionPayload } from '../actions';
import { TaskStateModel, AllTasksModel, Watchblock, Watch } from '../models';

export const taskStateReducer = handleActions<TaskStateModel, TaskStateActionPayload>(
    {
        [TaskStateAction.RELOAD_TASKS]: (state, action) => {
            return { ...state, allTasks: { ...state.allTasks, reload: state.allTasks.reload + 1 } };
        },
        [TaskStateAction.SET_CURRENT_TASK_ID]: (state, action) => ({
            ...state,
            currentTask: {
                id: (action.payload as unknown) as number,
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
                stdout: (action.payload as unknown) as string,
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_STDOUT]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                stdoutFileSize: (action.payload as unknown) as number,
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                watchblocks: (action.payload as unknown) as Watchblock,
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_WATCHBLOCKS_CHILDREN]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                watchblocks: {
                    ...state.currentTask.watchblocks,
                    children: (action.payload as unknown) as Array<Watchblock | Watch>,
                },
            },
        }),
        [TaskStateAction.SET_CURRENT_TASK_STDOUT]: (state, action) => ({
            ...state,
            currentTask: {
                ...state.currentTask,
                watchblockFileSize: (action.payload as unknown) as number,
            },
        }),
    },
    {
        allTasks: {
            current: [] as AllTasksModel,
            timeout: null,
            shouldReload: false,
            reload: 0,
        },
        currentTask: {
            id: -1,
            stdout: '',
            stdoutFileSize: 0,
            //watchblocks: { children: [] as Array<Watchblock | Watch> } as Watchblock,
            watchblocks: {
                id: '0',
                call_id: '0',
                type: 'watchblock',
                line: 0,
                name: 'root',
                children: [
                    {
                        id: '0',
                        call_id: '0',
                        type: 'number',
                        name: 'none',
                        line: 5,
                        data_type: '',
                        value: '0',
                        config: '',
                    },
                    {
                        id: '1',
                        call_id: '1',
                        type: 'array',
                        name: 'myArray',
                        line: 10,
                        data_type: '',
                        children: [
                            { id: '1.0', call_id: '1.0', name: '0', type: 'number', value: 10 },
                            { id: '1.1', call_id: '1.1', name: '1', type: 'number', value: 10 },
                            { id: '1.2', call_id: '1.2', name: '2', type: 'number', value: 10 },
                            { id: '1.3', call_id: '1.3', name: '3', type: 'number', value: 10 },
                            { id: '1.4', call_id: '1.4', name: '4', type: 'number', value: 10 },
                            {
                                id: '1.closing',
                                call_id: '1.closing',
                                closingType: 'array',
                                type: 'closing',
                            },
                        ],
                        state: { expanded: true },
                        config: '',
                    },
                    {
                        id: '2',
                        call_id: '2',
                        type: 'number',
                        name: 'a',
                        line: 11,
                        data_type: '',
                        value: '0',
                        config: '',
                    },
                    {
                        id: '2',
                        call_id: '2',
                        type: 'number',
                        name: 'b',
                        line: 11,
                        data_type: '',
                        value: '5',
                        config: '',
                    },
                    {
                        id: '3',
                        call_id: '3',
                        type: 'number',
                        name: '2d array',
                        line: 13,
                        data_type: '',
                        value: '',
                        config: '',
                    },
                    {
                        id: '4',
                        call_id: '4',
                        type: 'number',
                        name: 'changeValue 4',
                        line: 13,
                        data_type: '',
                        value: '5',
                        config: '',
                    },
                    {
                        id: '5',
                        call_id: '5',
                        type: 'number',
                        name: 'setColor',
                        line: 20,
                        data_type: '',
                        value: '',
                        config: '',
                    },
                    {
                        id: '6',
                        call_id: '6',
                        type: 'number',
                        name: 'setColorRow',
                        line: 21,
                        data_type: '',
                        value: '',
                        config: '',
                    },
                    {
                        id: '7',
                        call_id: '7',
                        type: 'number',
                        name: 'setCell',
                        line: 22,
                        data_type: '',
                        value: '',
                        config: '',
                    },
                    ...Array(2000)
                        .fill(false)
                        .map((val, index) => ({
                            id: (index + 10).toString(),
                            call_id: (index + 10).toString(),
                            type: 'number' as 'number',
                            name: `test ${index}`,
                            line: 30 + index,
                            data_type: '',
                            value: '',
                            config: '',
                        })),
                ],
                state: { expanded: true },
            },
            watchblockFileSize: 0,
        },
    }
);

export default taskStateReducer;
