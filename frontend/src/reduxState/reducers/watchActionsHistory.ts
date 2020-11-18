import { handleActions } from 'redux-actions';
import { WatchActionsHistoryActions, WatchActionsHistoryActionPayload } from '../actions';
import { WatchActionsHistoryModel, OneDimensionArrayActionType, TwoDimensionArrayActionType } from '../models';

export const watchActionsHistoryReducer = handleActions<WatchActionsHistoryModel, WatchActionsHistoryActionPayload>(
    {
        [WatchActionsHistoryActions.SET_WATCH_ACTIONS_HISTORY]: (state, action) => {
            const payload = action.payload as WatchActionsHistoryModel['history'];
            return {
                ...state,
                history: payload,
            };
        },
        [WatchActionsHistoryActions.ADD_TO_WATCH_ACTIONS_HISTORY]: (state, action) => {
            const payload = action.payload as WatchActionsHistoryModel['history'];
            return {
                ...state,
                history: {
                    ...state.history,
                    ...payload,
                },
            };
        },
        [WatchActionsHistoryActions.SET_WATCH_HISTORY_LOCATION]: (state, action) => {
            const payload = action.payload as string;
            return {
                ...state,
                location: payload,
            };
        },
    },
    {
        location: '-1',
        history: {},
        /*{
            '0': {
                previousKey: '-1',
                nextKey: '1',
                actions: [],
            },
            '1': {
                previousKey: '0',
                nextKey: '2',
                actions: [
                    {
                        targetObject: 'aaa',
                        action: OneDimensionArrayActionType.set_whole,
                        payload: [['10', '10', '10', '10', '10']],
                    },
                ],
            },
            '2': {
                previousKey: '1',
                nextKey: '3',
                actions: [
                    {
                        targetObject: 'aaa',
                        action: OneDimensionArrayActionType.set_cell,
                        payload: [0, '5'],
                    },
                ],
            },
            '3': {
                previousKey: '2',
                nextKey: '4',
                actions: [
                    {
                        targetObject: 'bbb',
                        action: TwoDimensionArrayActionType.set_whole,
                        payload: [
                            [
                                ['1', '2', '3', '4', '5'],
                                ['0', '0', '0', '0', '0', '0', '0'],
                                ['1234', '2'],
                            ],
                        ],
                    },
                ],
            },
            '4': {
                previousKey: '3',
                nextKey: '5',
                actions: [
                    {
                        targetObject: 'aaa',
                        action: OneDimensionArrayActionType.set_cell,
                        payload: [40, '5'],
                    },
                ],
            },
            '5': {
                previousKey: '4',
                nextKey: '6',
                actions: [
                    {
                        targetObject: 'aaa',
                        action: OneDimensionArrayActionType.set_cell_color,
                        payload: [4, 'green'],
                    },
                ],
            },
            '6': {
                previousKey: '5',
                nextKey: '7',
                actions: [
                    {
                        targetObject: 'bbb',
                        action: TwoDimensionArrayActionType.set_row_color,
                        payload: [1, ['purple', 'blue', 'darkcyan', 'green', 'yellow', 'orange', 'red']],
                    },
                ],
            },
            '7': {
                previousKey: '6',
                nextKey: '99',
                actions: [
                    {
                        targetObject: 'bbb',
                        action: TwoDimensionArrayActionType.set_cell,
                        payload: [3, 0, 'witaaaaam'],
                    },
                    {
                        targetObject: 'bbb',
                        action: TwoDimensionArrayActionType.set_cell,
                        payload: [7, 10, 'witaaaaam'],
                    },
                ],
            },
            '99': {
                previousKey: '7',
                nextKey: '100',
                actions: [],
            },
            ...Object.fromEntries(
                Array(1000)
                    .fill(false)
                    .map((val, index) => [
                        (index + 100).toString(),
                        {
                            previousKey: `${index + 99}`,
                            nextKey: `${index + 101}`,
                            actions: [
                                {
                                    targetObject: 'bbb',
                                    action: TwoDimensionArrayActionType.set_cell,
                                    payload: [
                                        Math.floor(Math.random() * 10),
                                        Math.floor(Math.random() * 10),
                                        Math.floor(Math.random() * 1000).toString(),
                                    ],
                                },
                            ],
                        },
                    ])
            ),
        },*/
    }
);

export default watchActionsHistoryReducer;
