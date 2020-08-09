export enum OneDimensionArrayActionType {
    set_whole = 'array_1d_set_whole',
    set_whole_color = 'array_1d_set_whole_color',
    set_cell = 'array_1d_set_cell',
    set_cell_color = 'array_1d_set_cell_color',
}

type OneDimensionArraySetWhole = {
    type: OneDimensionArrayActionType.set_whole;
    value: Array<string>;
};
type OneDimensionArraySetWholeColor = {
    type: OneDimensionArrayActionType.set_whole_color;
    value: Array<string>;
};
type OneDimensionArraySetCell = {
    type: OneDimensionArrayActionType.set_cell;
    index: number;
    value: string;
};
type OneDimensionArraySetCellColor = {
    type: OneDimensionArrayActionType.set_cell_color;
    index: number;
    value: string;
};

export type OneDimensionArrayAction =
    | OneDimensionArraySetWhole
    | OneDimensionArraySetWholeColor
    | OneDimensionArraySetCell
    | OneDimensionArraySetCellColor;
