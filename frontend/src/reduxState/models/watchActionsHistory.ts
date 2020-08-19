export enum OneDimensionArrayActionType {
    set_whole = 'array_1d_set_whole',
    set_whole_color = 'array_1d_set_whole_color',
    set_cell = 'array_1d_set_cell',
    set_cell_color = 'array_1d_set_cell_color',
}

export enum TwoDimensionArrayActionType {
    set_whole = 'array_2d_set_whole',
    set_whole_color = 'array_2d_set_whole_color',
    set_row = 'array_2d_set_row',
    set_row_color = 'array_2d_set_row_color',
    set_cell = 'array_2d_set_cell',
    set_cell_color = 'array_2d_set_cell_color',
}

export type WatchActionModel = {
    targetObject: string;
    action: OneDimensionArrayActionType | TwoDimensionArrayActionType | string;
    payload: any; // TODO: add payload type
};

export type WatchActionsHistoryModel = {
    history: {
        [key: string]: {
            previousKey: string;
            nextKey: string;
            actions: Array<WatchActionModel>;
        };
    };
    location: string;
};
