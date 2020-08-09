import { handleActions } from 'redux-actions';
import { WatchActionsHistoryActions, WatchActionsHistoryActionPayload } from '../actions';
import { WatchActionsHistoryModel, OneDimensionArrayActionType, TwoDimensionArrayActionType } from '../models';

export const watchActionsHistoryReducer = handleActions<WatchActionsHistoryModel, WatchActionsHistoryActionPayload>(
    {
        [WatchActionsHistoryActions.SET_WATCH_ACTIONS_HISTORY]: (state, action) => {
            const payload = (action.payload as unknown) as WatchActionsHistoryModel['history'];
            return {
                ...state,
                history: payload,
            };
        },
        [WatchActionsHistoryActions.SET_WATCH_HISTORY_LOCATION]: (state, action) => {
            const payload = (action.payload as unknown) as string;
            return {
                ...state,
                location: payload,
            };
        },
    },
    {
        location: '-1',
        history: {
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
                        type: OneDimensionArrayActionType.set_whole,
                        value: ['10', '10', '10', '10', '10'],
                    },
                ],
            },
            '2': {
                previousKey: '1',
                nextKey: '3',
                actions: [
                    {
                        targetObject: 'aaa',
                        type: OneDimensionArrayActionType.set_cell,
                        index: 0,
                        value: '5',
                    },
                ],
            },
            '3': {
                previousKey: '2',
                nextKey: '4',
                actions: [
                    {
                        targetObject: 'bbb',
                        type: TwoDimensionArrayActionType.set_whole,
                        value: [
                            ['1', '2', '3', '4', '5'],
                            ['0', '0', '0', '0', '0', '0', '0'],
                            ['1234', '2'],
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
                        type: OneDimensionArrayActionType.set_cell,
                        index: 40,
                        value: '5',
                    },
                ],
            },
            '5': {
                previousKey: '4',
                nextKey: '6',
                actions: [
                    {
                        targetObject: 'aaa',
                        type: OneDimensionArrayActionType.set_cell_color,
                        index: 4,
                        value: 'green',
                    },
                ],
            },
            '6': {
                previousKey: '5',
                nextKey: '7',
                actions: [
                    {
                        targetObject: 'bbb',
                        type: TwoDimensionArrayActionType.set_row_color,
                        index: 1,
                        value: ['purple', 'blue', 'darkcyan', 'green', 'yellow', 'orange', 'red'],
                    },
                ],
            },
            '7': {
                previousKey: '6',
                nextKey: '99',
                actions: [
                    {
                        targetObject: 'bbb',
                        type: TwoDimensionArrayActionType.set_cell,
                        firstIndex: 3,
                        secondIndex: 0,
                        value: 'witaaaaam',
                    },
                    {
                        targetObject: 'bbb',
                        type: TwoDimensionArrayActionType.set_cell,
                        firstIndex: 7,
                        secondIndex: 10,
                        value: 'witam',
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
                                    type: TwoDimensionArrayActionType.set_cell,
                                    firstIndex: Math.floor(Math.random() * 10),
                                    secondIndex: Math.floor(Math.random() * 10),
                                    value: Math.floor(Math.random() * 1000).toString(),
                                },
                            ],
                        },
                    ])
            ),
        },
    }
);

export default watchActionsHistoryReducer;
