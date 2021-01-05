export enum OneDimensionArrayActionType {
    set_whole = 'array_1d_set_whole',
    set_whole_color = 'array_1d_set_whole_color',
    set_cell = 'array_1d_set_cell',
    set_cell_color = 'array_1d_set_cell_color',
    clear_whole = 'array_1d_clear_whole',
    clear_whole_color = 'array_1d_clear_whole_color',
}

export const OneDimensionArrayActionArguments = {
    [OneDimensionArrayActionType.set_whole]: ['entire_array'],
    [OneDimensionArrayActionType.set_whole_color]: ['entire_color_array'],
    [OneDimensionArrayActionType.set_cell]: ['index', 'value'],
    [OneDimensionArrayActionType.set_cell_color]: ['index', 'color_value'],
    [OneDimensionArrayActionType.clear_whole]: [] as string[],
    [OneDimensionArrayActionType.clear_whole_color]: [] as string[],
};

export enum TwoDimensionArrayActionType {
    set_whole = 'array_2d_set_whole',
    set_whole_color = 'array_2d_set_whole_color',
    set_row = 'array_2d_set_row',
    set_row_color = 'array_2d_set_row_color',
    set_cell = 'array_2d_set_cell',
    set_cell_color = 'array_2d_set_cell_color',
    clear_whole = 'array_2d_clear_whole',
    clear_whole_color = 'array_2d_clear_whole_color',
}

export const TwoDimensionArrayActionArguments = {
    [TwoDimensionArrayActionType.set_whole]: ['entire_array'],
    [TwoDimensionArrayActionType.set_whole_color]: ['entire_color_array'],
    [TwoDimensionArrayActionType.set_row]: ['vertical_index', 'row_value'],
    [TwoDimensionArrayActionType.set_row_color]: ['vertical_index', 'color_row_value'],
    [TwoDimensionArrayActionType.set_cell]: ['horizontal_index', 'vertical_index', 'value'],
    [TwoDimensionArrayActionType.set_cell_color]: ['horizontal_index', 'vertical_index', 'color_value'],
    [TwoDimensionArrayActionType.clear_whole]: [] as string[],
    [TwoDimensionArrayActionType.clear_whole_color]: [] as string[],
};

export const WatchActionArguments = {
    ...OneDimensionArrayActionArguments,
    ...TwoDimensionArrayActionArguments,
};

export type WatchActionType = OneDimensionArrayActionType | TwoDimensionArrayActionType;

export type WatchActionModel = {
    targetObject: string;
    action: WatchActionType;
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
